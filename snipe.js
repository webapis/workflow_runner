// debugger;
// const fetch = require('node-fetch')
// require('dotenv').config()
// const { updateIdToken, fbRest,renewIdToken } = require('./firebase-rest.js')
// const fetchUrl = `https://workflow-prod-799d4-default-rtdb.firebaseio.com/.json?auth=eyJhbGciOiJSUzI1NiIsImtpZCI6ImIwNmExMTkxNThlOGIyODIxNzE0MThhNjdkZWE4Mzc0MGI1ZWU3N2UiLCJ0eXAiOiJKV1QifQ.eyJwaWN0dXJlIjoiaHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzkwNDU0NDYxP3Y9NCIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS93b3JrZmxvdy1wcm9kLTc5OWQ0IiwiYXVkIjoid29ya2Zsb3ctcHJvZC03OTlkNCIsImF1dGhfdGltZSI6MTY0ODAwOTkwMSwidXNlcl9pZCI6InRveGFCbWVhbFFOQlZXSHlXN1FrdXBjMlFLMjMiLCJzdWIiOiJ0b3hhQm1lYWxRTkJWV0h5VzdRa3VwYzJRSzIzIiwiaWF0IjoxNjQ4MDA5OTAxLCJleHAiOjE2NDgwMTM1MDEsImVtYWlsIjoiY29kZXIuZ2lodWJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImdpdGh1Yi5jb20iOlsiOTA0NTQ0NjEiXSwiZW1haWwiOlsiY29kZXIuZ2lodWJAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ2l0aHViLmNvbSJ9fQ.eXC1kZc4N_FLCqAmJBNnBS3pG-mkbNTJA5auRtoOrzNVHwhh-_FLsKVKCNBj7GDZ0sen441qPHL-fpJrktHhGYPwAXcoCMEyMJ18yhvnbhO56vvFDznXBZwjMXuZujC3wWBvs0avnvho32FFREJ7TqepHd5FpMWD2jm3XsbEg4G4ISEEwtu8mqe6rDXZZj28KeoZqRaab9ibvF_U3hPX8LdWSO8eEfM0ahRDqeayo_ciQw80Se9R7EZAnBN_XeauoSruwyDYrABGofeZzzy75t4PQIMeqZ3RdFH8B9kCa_V5TG4rFgVlinNMVIx_9PShOldbnYgE4LQyUnI0WLTJWQ`
// fetch(fetchUrl).then(async response => {

//     const status = response.status
//     const statusText = response.statusText
//     if (status === 401 && statusText === 'Unauthorized') {
//         debugger;
//         const data = await response.json()
//         const error = data['error']
//         if (error && error === 'Auth token is expired') {
//             debugger;
//           const response =  await renewIdToken({api_key:'AIzaSyCM7LDPIq6eelnMH_A8SARtIBDT5Zi5tK8',refresh_token:`AIwUaOkRflq115BKDTTt8V7xjnrxEiTwuUrkz6hjHAHJBOrYnXsOKtrbxQssDrYvHGOSujdDFGXiP0adeIfqasdAlhFj4c7a44jE7grP0RPMDDFH8TnmgAgfchrqB7-ewR9oZFdmx3kYQhT0AELG4T2DYKV5L_Te7cgZDM491tuLqF71t8c0ZcnBXhDVQKQAyliYWj0HAaoB0Fj22qMYINnl6dm6Yb1FAjgc_AUJxdipAEICNp6kMeAGkQae5T0zTfPB5tZU4fHXEvjjYi7h_w_JtTMTfFT1Mj2mmVYlkOJ0wZXRtsxtt5cnoPS0WscMMQ8w-GqFxm-r71aZ7t9N5pcZMHClcr2aBA`})
//             debugger;

            
//         } else {
//             debugger;
//             throw 'Unhandled firebase auth error'
//         }

//         debugger;
//     } else {
//         return response.json()
//     }
//     debugger;


// }).then(async workflows => {
//     debugger;
// }).catch((error) => {
//     debugger;
// })

// "eyJhbGciOiJSUzI1NiIsImtpZCI6ImIwNmExMTkxNThlOGIyODIxNzE0MThhNjdkZWE4Mzc0MGI1ZWU3N2UiLCJ0eXAiOiJKV1QifQ.eyJwaWN0dXJlIjoiaHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzYwMDgzNTY4P3Y9NCIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS93b3JrZmxvdy1wcm9kLTc5OWQ0IiwiYXVkIjoid29ya2Zsb3ctcHJvZC03OTlkNCIsImF1dGhfdGltZSI6MTY0ODExMzIxNywidXNlcl9pZCI6IjFUbWlWQXRmdUhVb3pCOGlSNk94TWJUVFRmNTIiLCJzdWIiOiIxVG1pVkF0ZnVIVW96QjhpUjZPeE1iVFRUZjUyIiwiaWF0IjoxNjQ4MTEzMjE3LCJleHAiOjE2NDgxMTY4MTcsImVtYWlsIjoid2ViYXBpcy5naXRodWJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImdpdGh1Yi5jb20iOlsiNjAwODM1NjgiXSwiZW1haWwiOlsid2ViYXBpcy5naXRodWJAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ2l0aHViLmNvbSJ9fQ.WNEWWBIMOVbjKVb2FIWV8-7pfKUsCToOigAAV_AOMed-b7gDktcledzE6YmGX65ZwgRCMHSg6J6pBJ_9MQFiOObZ8yCnjuF3doF5IcE_eAMB6eEeFLIbjBfOkzHiqPqKtk6vEspzNj-3do8cqxAsLdi2YvNvFikq-za8tRO29wVXwlyWfva9lzDkdvuvso8twWw4oyh4sCQxsogesNUsR4BNzXvu5xlsyiWPRd8nCESyce1GJUJBz2OqhsCW1-F3IfGa2fRXRe6ilK2-d-y9cBoH6OW9fPDdDAXwDp-sJ_iPar2J_PH1YsrcPKOprc_6qk74JT6CfeiAwUZHI28mcw"
// //eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ2NDExN2FjMzk2YmM3MWM4YzU5ZmI1MTlmMDEzZTJiNWJiNmM2ZTEiLCJ0eXAiOiJKV1QifQ.eyJwaWN0dXJlIjoiaHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzkwNDU0NDYxP3Y9NCIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS90dXJrbWVuaXN0YW4tbWFya2V0IiwiYXVkIjoidHVya21lbmlzdGFuLW1hcmtldCIsImF1dGhfdGltZSI6MTY0ODQ0MjA0OCwidXNlcl9pZCI6InEzSzdVS2RLczJndFppRkhiUzhsNHNIbHJmdTIiLCJzdWIiOiJxM0s3VUtkS3MyZ3RaaUZIYlM4bDRzSGxyZnUyIiwiaWF0IjoxNjQ4NDQyMDQ4LCJleHAiOjE2NDg0NDU2NDgsImVtYWlsIjoiY29kZXIuZ2lodWJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImdpdGh1Yi5jb20iOlsiOTA0NTQ0NjEiXSwiZW1haWwiOlsiY29kZXIuZ2lodWJAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ2l0aHViLmNvbSJ9fQ.A_HMepebX3Vu8T26P_h4UyaaMXcEzBUyzEwR8CaGBPBvz6Mltpab1nAbHJNG5JpJMpCzEA4pAa9Bg5FQxTQlb_WSga8Eub7NSEfY9kVmGbAD8KpoiATO_x0fX__SQOCHPMi7_bOppl9wFD4cpnIGoFQLsOz1qPU9UzVqTUBgRB70J5O5Gj54Jk1ZCA3M53UxrdwZz604DTEHfqoz-Zo-zP8Rnb-ggvoernJL0py7JekoouRH_2gV6kO1sofs1ZbY61eFjC6qSiBqyfqUsIeqz0Uygm15ZGK7oTY-w3OH9GHrnVazjPmz8RL5i8UISSpC9LRCA5DYsxQcMKn5bHM0GQ