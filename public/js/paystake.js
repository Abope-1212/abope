// import PaystackPop from '@paystack/inline-js'
// import { access } from 'fs'
// const https = require ('http')

// const params = JSON.stringify({
//     "email" : "waleagbeniga06@gmail.com",
//     "amount" : "20000"
// })

// const options = {
//     hostname: 'api.paystack.co',
//     port: 433,
//     path: '/transaction/initialize',
//     method: 'POST'
//     headers: {
//         Authorization:
//         'Content-Type': 'application/json'
//     }
// }

// const req = https.request(options, res => {
//     let data = ''

//     res.on('data', (chunk) => {
//         data += chuck
//     });
//     res.on('end', () => {
//         console.log(JSON.parse(data))
//     })
// }).on('error', error => {
//     console.error(error)
// })

// req.write(params)
// res.end()

// const popup = new PaystackPop()
// popup.resumeTransaction(access_code)
