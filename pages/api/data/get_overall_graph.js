const s3 = require('../../../utils/s3')
import { getSession } from 'next-auth/client'


export default async (req, res) => {
    let session = await getSession({ req })
    // dev
    // session = {user: {email: 'cheskel@linnovate.net'}}
    if (session){
      const domain = session.user.email.split('@')[1];
      if (domain === 'linnovate.net') {
          const graphData = []
          let results = {}
          let months = []
          let azureData = await s3.getObjectJson('hossted-test-reports', 'azure/azure_overall_usage.json')
          console.log(azureData)
          months.push(...azureData.months)
          let data = await s3.getObjectJson('hossted-test-reports', 'from-node/offer_daily_usage.json')
          for (let entry of data) {
            let month = entry.date.split('-').slice(0, 2).join('-')
            if (months.indexOf(month) === -1) {
                months.push(month)
            }
            delete entry.date
            for (let offerId of Object.keys(entry)) {
                results[month] = (results[month] || 0) + entry[offerId]
            }
          }
        const entry = {
            name: 'Aws',
            data: []
        }
        for (let month of months) {
            entry.data.push(results[month] || 0)
        }
        console.log(months)
        graphData.push(entry)
        graphData.push(azureData.data[0])
        // graphData.sort((a,b) => b.data.reduce((a,b) => a+b, 0) - a.data.reduce((a,b) => a+b, 0))
        console.log(graphData)
        res.send({ series: graphData, months: months})
      } else {
        res.send({ error: domain + 'is not allowed to connect' })
      }
    } else {
      res.send({ error: 'Sorry no anonoymous or unauthorised access allowed to this page'})
    }
  }
