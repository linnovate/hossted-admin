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
          let months = []
          let azureData = await s3.getObjectJson('hossted-test-reports', 'azure/azure_overall_usage.json')
          months.push(...azureData.months)
          let awsData = await s3.getObjectJson('hossted-test-reports', 'aws/overall_data.json')
          for (let month of azureData.months) {
            if (awsData.months.indexOf(month) === -1) {
                awsData.data.unshift(0)
            }
          }
      
        graphData.push({name: awsData.name, data: awsData.data})
        graphData.push(azureData.data[0])
        res.send({ series: graphData, months: months})
      } else {
        res.send({ error: domain + 'is not allowed to connect' })
      }
    } else {
      res.send({ error: 'Sorry no anonoymous or unauthorised access allowed to this page'})
    }
  }
