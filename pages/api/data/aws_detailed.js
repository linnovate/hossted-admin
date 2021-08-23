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
          let data = await s3.getObjectJson('hossted-test-reports', 'aws/detailed_data.json')

          let cleanedProducts = []
          let arrayLength = data.products.length;
          for (var i = 0; i < arrayLength; i++) {
            if (data.products[i].data.some(v => v)){
              cleanedProducts.push(data.products[i])
              }
            }

            cleanedProducts.sort((a,b) => b.data.reduce((a,b) => a+b, 0) - a.data.reduce((a,b) => a+b, 0))
          
          res.send({ series: cleanedProducts, months: data.source_months})
      } else {
        res.send({ error: domain + 'is not allowed to connect' })
      }
    } else {
      res.send({ error: 'Sorry no anonoymous or unauthorised access allowed to this page'})
    }
  }
