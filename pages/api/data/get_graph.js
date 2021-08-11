const s3 = require('../../../utils/s3')
import { getSession } from 'next-auth/client'



function aggregateData(data) {

}

export default async (req, res) => {
    let session = await getSession({ req })
    // dev
    // session = {user: {email: 'cheskel@linnovate.net'}}
    if (session){
      const domain = session.user.email.split('@')[1];
      console.log(domain)
      if (domain === 'linnovate.net') {
          const graphData = []
          let results = {}
          let months = []
          let productMap = await s3.getObjectCsv('marketplace-hossted', 'ProductFeed_V1/year=2021/month=08/data.csv')
          let data = await s3.getObjectJson('hossted-test-reports', 'from-node/offer_daily_usage.json')
          for (let entry of data) {
            let month = entry.date.split('-').slice(0, 2).join('-')
            if (!(month in results)) {
                results[month] = {}
                months.push(month)
            }
            delete entry.date
            for (let offerId of Object.keys(entry)) {
                results[month][offerId] = (results[month][offerId] || 0) + entry[offerId]
            }
          }
            for (let product of productMap) {
                let entry = {
                    name: product['title'],
                    data: []
                }
                let offerId = product['product_code']
                for (let month of Object.keys(results)) {
                    entry.data.push(results[month][offerId] || 0)
                }
                graphData.push(entry)
            }
          
        //   console.log(graphData)
          res.send({ series: graphData, months: months})
      } else {
        res.send({ error: domain + 'is not allowed to connect' })
      }
    } else {
      res.send({ error: 'Sorry no anonoymous or unauthorised access allowed to this page'})
    }
  }
