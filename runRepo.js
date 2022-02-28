
const fetch = require('node-fetch')
const { Worker } = require("worker_threads");
const { fbRest } = require('./firebase-rest')
const fs = require('fs')
const makeDir = require('make-dir');
const pather = require('path')
const fbDatabase = fbRest().setIdToken(process.env.idToken).setProjectUri(process.env.projectUrl)
var exec = require('child_process').exec
async function runRepo({ workflow, workflowEmitter }) {

    const { screenName,
        repoName,
        taskId,
        selectedBranch,
        workflowKey } = workflow


    const gh_token = process.env.gh_token

    //1.GET CONTENTS FROM WORKFLOW REPO
    const tree = await getWorkflowSourceCodeTree({ owner: screenName, repoName, token: gh_token, selectedBranch })

    const contents = await getContentsFromWorkflowRepo({ owner: screenName, repoName, tree, token: gh_token })
    //2.SAVE CONTENT TO ROOT FOLDER

    for (let c of contents) {
        const { content, path } = c
        const utfContent = Buffer.from(content, 'base64').toString('utf-8')

        const filepath = `${process.cwd()}/${repoName}/${path}`
        const dirpath = pather.dirname(filepath)
        makeDir.sync(dirpath)
        fs.writeFileSync(filepath, utfContent)

    }


    //3.INSTALL DEPENDENECIES

    let dependencyArray = []
    let dependencies = ''


    const { dependencies: originalDependencies } = require(`${process.cwd()}/${repoName}/package.json`)




    for (let obj in originalDependencies) {

        const value = originalDependencies[obj].replace('^', '')
        dependencyArray.push(`${obj}@${value}`)

    }
    dependencies = dependencyArray.join(' ')

    console.log('dependencies....', dependencies)
    //npm i ${dependencies}
    //process.env.LOCAL === 'true' ? `echo 'local dev....'` : 
    var cmd = exec(process.env.LOCAL === 'true' ? `echo 'local dev....'` : `npm install ${dependencies}`, function (err, stdout, stderr) {

        console.log('stderr', stderr)
        if (err) {

            // handle error
            console.log('dependencies not installed', err)
        }
        else {

            //4.RUN WORKFLOW ENTRY FILE
            console.log('dependencies installed')
            const updateWfLogRef = `workflowLogs/${process.env.selectedWorkspace}/tasks/${taskId}/workflows/${workflowKey}/${process.env.runid}`

            const update = { [updateWfLogRef]: { runState: 1, start: Date.now() } }

            fbDatabase.ref('/').update(update, async (error, response) => {

                if (!error) {

                    const main = `${process.cwd()}/${repoName}/main.js`

                    const worker = new Worker(main, { workerData: {} });
                    worker.once("message", result => {
                        console.log(`${number}th Fibonacci No: ${result}`);
                    });

                    worker.on("error", error => {

                        const update = { [updateWfLogRef]: { runState: 2, end: Date.now(), error: true } }
                        global[`task${taskId}complete`] = ++global[`task${taskId}complete`]
                        global[`task${taskId}error`] = ++global[`task${taskId}error`]
                        fbDatabase.ref('/').update(update, async (error, response) => {
                            if (!error) {
                                console.log(`It exited with code ${exitCode}`);
                                workflowEmitter.emit("WORKFLOW_RUN_FAILED", { taskId, workflowKey })
                            } else {
                                console.log('firebase error', error)
                            }

                        })

                    });

                    worker.on("exit", exitCode => {
                        const update = { [updateWfLogRef]: { runState: 2, end: Date.now(), error: false } }
                        global[`task${taskId}complete`] = ++global[`task${taskId}complete`]
                        global[`task${taskId}success`] = ++global[`task${taskId}success`]
                        fbDatabase.ref('/').update(update, async (error, response) => {
                            if (!error) {
                                console.log(`It exited with code ${exitCode}`);
                                workflowEmitter.emit("WORKFLOW_RUN_SUCCESSFUL", { taskId, workflowKey })
                            } else {
                                console.log('firebase error', error)
                            }

                        })



                    })

                } else {
                    console.log('firebase error', error)
                    //error happened
                }


            })



            setInterval(() => { }, 5000)
        }
        console.log(stdout);
    });





}//runRepo

async function getContentsFromWorkflowRepo({ owner, repoName, tree, token }) {

    const getContent = async function ({ path }) {
        const fetchPath = `https://api.github.com/repos/${owner}/${repoName}/contents/${path}`

        const response = await fetch(fetchPath, { method: 'GET', headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` } })
        const data = await response.json()

        return data;
    }

    const withoutTypeTree = tree.filter(f => f.type !== 'tree')
    const contents = []
    for (let t of withoutTypeTree) {
        const content = await getContent({ path: t.path })

        contents.push(content)
    }

    return contents
}

async function getWorkflowSourceCodeTree({ owner, repoName, token, selectedBranch }) {

    // Retrieve source code for project
    //Retrieved source code will be copied to project branch of forked agregators repo
    //---- List branches endpoint----
    /*required for the next endoint*/
    const fetchPath = `https://api.github.com/repos/${owner}/${repoName}/branches`

    const response = await fetch(fetchPath, { method: 'GET', headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` } })
    const data = await response.json()

    const mainSha = data.find(d => d.name === selectedBranch)
    const { commit: { sha } } = mainSha

    //------Git database / Get a tree endpoint------
    /*required to retrieve list of file and folder into*/
    const treeResponse = await fetch(`https://api.github.com/repos/${owner}/${repoName}/git/trees/${sha}?recursive=1`, { method: 'GET', headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` } })
    const treeData = await treeResponse.json()
    const { tree } = treeData

    return tree
}
async function triggerAction({ ticket, body, gh_action_url }) {
    await fetch(gh_action_url, {
        method: 'post',
        headers: {
            authorization: `token ${ticket}`,
            Accept: 'application/vnd.github.v3+json'
        },
        body
    })

}
module.exports = { runRepo, triggerAction }