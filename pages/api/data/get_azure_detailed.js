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
          let data = await s3.getObjectJson('hossted-test-reports', 'azure/azure_detailed_usage_by_prod.json')
          
          res.send({ series: data.data.slice(0, 20), months: data.months})
      } else {
        res.send({ error: domain + 'is not allowed to connect' })
      }
    } else {
      res.send({ error: 'Sorry no anonoymous or unauthorised access allowed to this page'})
    }
  }
