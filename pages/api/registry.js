// This is an example of to protect an API route
import { getSession } from 'next-auth/client'
const s3 = require('../../utils/s3')


function getmachine(machines, ip) {
    return machines.find(e => e.ip === ip)
}

function deleteMachine(machines, ip) {
    let index = machines.findIndex(e => e.ip === ip)
    if (index >= 0) {
      machines.splice(index, 1)
      return machines
    }
    return false
}

function addMachine(machines, update) {
  let ip = update.get('ip')
  if (!(machines.findIndex(e => e.ip === ip) >= 0)) {
    let homepage = update.get('url')
    let user = update.get('user')
    let pass = update.get('pass')
    let product = update.get('product')
    let status = update.get('status')
    let cpunum = update.get('cpunum')
    let mem = update.get('mem')
    let rootsize = update.get('rootsize')
    let machine = {
      ip: ip,
      url: homepage,
      user: user,
      pass: pass,
      product: product,
      status: status,
      cpunum: cpunum,
      mem: mem,
      rootsize: rootsize
    }
    machines.push(machine)
    return machines
  }
  return false
}


function updateMachine(machines, ip, update) {
  let index = machines.findIndex(e => e.ip === ip)
     if (index >= 0) {
      let machine = machines[index]
      machine.url = update.get('url') || machine.url
      machine.user = update.get('user') || machine.user
      machine.pass = update.get('pass') || machine.pass
      machine.product = update.get('product') || machine.product
      machine.status = update.get('status') || machine.status
      machine.cpunum = update.get('cpunum') || machine.cpunum
      machine.mem = update.get('mem') || machine.mem
      machine.rootsize = update.get('rootsize') || machine.rootsize
      machines[index] = machine
      return machines
    }
    return false
}

export default async (req, res) => {
  let session = await getSession({ req })

  // dev
  // session = {user: {email: 'cheskel@linnovate.net'}}
  if (session){
    const domain = session.user.email.split('@')[1];
    if (domain === 'linnovate.net') {
      req.headers.authorization = `Basic ${process.env.read_api_key}`
    }
  }
  let registry = await s3.getObjectJson('hossted-test-reports', 'registry/db.json')
  let machines = registry.data || []
  let url = new URL('https://admin.hossted.com' + req.url)
  if (req.method === 'POST') {
    if (req.headers.authorization == `Basic ${process.env.post_api_key}`) {
      machines = addMachine(machines, url.searchParams)
      if (machines) {
        registry.data = machines
        s3.putObject('hossted-test-reports', 'registry/db.json', JSON.stringify(registry))
        res.send({ message: 'success'})
      } else {
        res.send({ message: 'ip already exists'})
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
            res.send({ message: 'ip was not found'})
        }
    } else {
      res.send({ message: 'unauthorized'})
    }
  } else if (req.method == 'PATCH') {
    if (req.headers.authorization == `Basic ${process.env.read_api_key}`) {
      let ip = url.searchParams.get('ip')
      machines = updateMachine(machines, ip, url.searchParams)
      if (machines) {
          registry.data = machines
          s3.putObject('hossted-test-reports', 'registry/db.json', JSON.stringify(registry))
          res.send({ message: 'success'})
      }
      else {
          res.send({ message: 'ip was not found'})
      }
  } else {
    res.send({ message: 'unauthorized'})
  }
  }
}
