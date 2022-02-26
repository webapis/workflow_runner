const { fbRest } = require('./firebase-rest')

const EventEmitter = require('events');
const { runRepo } = require('./runRepo')
const { timespan } = require('./utils/timespan')
const fetch = require('node-fetch')
const { triggerNextTask } = require('./helper')
const fbDatabase = fbRest().setIdToken(process.env.idToken).setProjectUri(process.env.projectUrl)


const workflowEvents = {
    START_WORKFLOW_RUNNER: 'START_WORKFLOW_RUNNER',
    WORKFLOW_RUN_SUCCESSFUL: 'WORKFLOW_RUN_SUCCESSFUL',
    WORKFLOW_RUN_FAILED: 'WORKFLOW_RUN_FAILED'
}

class WorkFlowListender extends EventEmitter {
    constructor({ workflows }) {
        
        super()
        this.workflows = workflows
        this.on(workflowEvents.START_WORKFLOW_RUNNER, async function () {
            const workflow = this.workflows[0]

            const fbWorkflowRef = `server/workspaces/${process.env.selectedWorkspace}/tasks/${workflow.taskId}/workflows/${workflow.workflowKey}/vars`

            fbDatabase.ref(fbWorkflowRef).on('value', async (error, response) => {

                

                //SET LOCAL VARS FROM STORAGE
                if (response && response.data) {
                    const { data } = response
                    
                    for (let d in data) {

                        let envName = data[d]['varName']
                        let envValue = data[d]['value']
                        process.env[envName] = envValue
                        
                    }

                }



                debugger;
                await runRepo({ workflow, workflowEmitter: this })
                debugger;
            })


        })
        this.on(workflowEvents.WORKFLOW_RUN_SUCCESSFUL, async function ({ taskId,
            workflowKey }) {
            const nextWorkflow = this.workflows.find(t => t.workflowKey > workflowKey)

            if (nextWorkflow) {
                
                const fbWorkflowRef = `server/workspaces/${process.env.selectedWorkspace}/tasks/${nextWorkflow.taskId}/workflows/${nextWorkflow.workflowKey}/vars`

                fbDatabase.ref(fbWorkflowRef).on('value', async (error, response) => {

                    
                    if (response && response.data) {
                        const { data } = response
                        
                        for (let d in data) {

                            let envName = data[d]['varName']
                            let envValue = data[d]['value']
                            process.env[envName] = envValue
                            
                        }

                    }
                    debugger;
                    await runRepo({ workflow: nextWorkflow, workflowEmitter: this })
                    debugger;
                })
            } else {
                try {
                    let html_url = ''
                    if (process.env.GITHUB_RUN_ID) {
                        const fetchPath = `https://api.github.com/repos/${process.env.owner}/workflow_runner/actions/runs/${process.env.GITHUB_RUN_ID}`

                        const response = await fetch(fetchPath, { method: 'GET', headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${process.env.gh_token}` } })
                        const data = await response.json()
                        html_url = data.html_url
                        console.log('GITHUB_RUN_DATA', data)
                    }
                    var date1 = new Date(parseInt(process.env.start))
                    var date2 = new Date(global.endTime.getTime())
                    const { hours, mins, seconds } = timespan(date2, date1)
                    const duration = `${hours}:${mins}:${seconds}`
                    const start = parseInt(process.env.start)
                    const update = { [`runs/${process.env.selectedWorkspace}/${process.env.runid}`]: { runState: 2, duration, end: global.endTime.getTime(), start, html_url } }
                    fbDatabase.ref('/').update(update, async (error, data) => {
                        
                        console.log('workflows complete1....')
                        process.exit(0)

                    })

                    if (process.env.runSequence === 'sequential' && process.env.runNext === 'true') {
                        debugger;
                    //    await triggerNextTask(taskId)
                    }

                } catch (error) {
                    console.log('error', error)
                }

                

            }



        })
        this.on(workflowEvents.WORKFLOW_RUN_FAILED, async function ({ taskName,
            workflowKey }) {

            const nextWorkflow = this.workflows.find(t => t.workflowKey > workflowKey)

            if (nextWorkflow) {
                const fbWorkflowRef = `server/workspaces/${process.env.selectedWorkspace}/tasks/${nextWorkflow.taskId}/workflows/${nextWorkflow.workflowKey}/vars`

                fbDatabase.ref(fbWorkflowRef).on('value', async (error, response) => {

                    
                    if (response && response.data) {
                        const { data } = response
                        
                        for (let d in data) {

                            let envName = data[d]['varName']
                            let envValue = data[d]['value']
                            process.env[envName] = envValue
                            
                        }

                    }

                    await runRepo({ workflow: nextWorkflow, workflowEmitter: this })
                    debugger;
                })
            } else {
                console.log('workflows complete2....')
                process.exit(0)
            }
        })

    }
}
function workflowRunner({ workflows }) {
    
    const promiseEmitter = new WorkFlowListender({ workflows });
    promiseEmitter.setMaxListeners(50);
    return promiseEmitter;
}


module.exports = { workflowRunner, workflowEvents }


