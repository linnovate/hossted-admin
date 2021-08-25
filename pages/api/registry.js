// This is an example of to protect an API route
import { getSession } from 'next-auth/client'
const s3 = require('../../utils/s3')


function getmachine(machines, ip) {
    return machines.find(e => e.ip === ip)
}

function deleteMachine(machines, ip) {
    let index = machines.findIndex(e => e.ip === ip)
    if (!(index >= 0)) {
      machines.splice(index, 1)
      return false
    }
    return machines
}

export default async (req, res) => {
  let session = await getSession({ req })
  // add password pro
  session = {user: {email: 'cheskel@linnovate.net'}}
  if (session){
    const domain = session.user.email.split('@')[1];
    if (domain === 'linnovate.net') {
        let registry = await s3.getObjectJson('hossted-test-reports', 'registry/db.json')
        let machines = registry.data || []
        let url = new URL('https://admin.hossted.com' + req.url)
        if (req.method === 'POST') {
          if (req.headers.authorization == `Basic ${process.env.post_api_key}`) {
            let ip = url.searchParams.get('ip')
            let homepage = url.searchParams.get('url')
            let user = url.searchParams.get('user')
            let pass = url.searchParams.get('pass')
            let product = url.searchParams.get('product')
            let data = {
                ip: ip,
                url: homepage,
                user: user,
                pass: pass,
                product: product,
            }
            if (ip) {
              machines.push(data)
              registry.data = machines
              s3.putObject('hossted-test-reports', 'registry/db.json', JSON.stringify(registry))
              res.send({ message: 'success'})
            } else {
              res.send({ message: 'got no ip!!!1'})
            }

          } else {
            res.send({ message: 'unauthorized'})
          }

        } else if (req.method == 'GET') {
          if (req.headers.authorization == `Basic ${process.env.read_api_key}`) {
            let ip = url.searchParams.get('ip')
            if (ip) {
                let machine = getmachine(machines, ip)
                res.status(200).json(machine)
            } else {
                res.status(200).json(machines)
            }
          } else {
            res.send({ message: 'unauthorized'})
          }
          } else if (req.method == 'DELETE') {
            if (req.headers.authorization == `Basic ${process.env.read_api_key}`) {
              let ip = url.searchParams.get('ip')
              if (deleteMachine(machines, ip)) {
                  registry.data = machines
                  s3.putObject('hossted-test-reports', 'registry/db.json', JSON.stringify(registry))
                  res.send({ message: 'success'})
              }
              else {
                  res.send("no ip!")
              }
          } else {
            res.send({ message: 'unauthorized'})
          }
        }
    } else {
      res.send({ content: domain + ' is not a linnovate or a hossted domain' })
    }
  } else {
    res.send({ error: 'Sorry no anonoymous or unauthorised access allowed to this page'})
  }
}
