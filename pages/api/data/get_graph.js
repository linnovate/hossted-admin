const s3 = require('../../../utils/s3')
import { getSession } from 'next-auth/client'
// dev
// require('dotenv').config();


export default async (req, res) => {
    const session = await getSession({ req })
    // let data = await s3.getObjectJson('from-node/offer_daily_usage.json')
    // res.send({ data: data})
    if (session){
      const domain = session.user.email.split('@')[1];
      if (domain === 'linnovate.net') {
          let data = await s3.getObjectJson('from-node/offer_daily_usage.json')
          res.send({ data: data})
      } else {
        res.send({ error: domain + 'is not allowed to connect' })
      }
    } else {
      res.send({ error: 'Sorry no anonoymous or unauthorised access allowed to this page'})
    }
  }
