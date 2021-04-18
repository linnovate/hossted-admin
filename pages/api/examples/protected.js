// This is an example of to protect an API route
import { getSession } from 'next-auth/client'

export default async (req, res) => {
  const session = await getSession({ req })
  const domain = session.user.email.split('@')[0];
  
  if (domain){
    if (domain === 'linnovate.net') {
      res.send({ content: 'This is protected content. You can access this content because you are signed in.' })
    } else {
      res.send({ error: domain + 'is not allowed to connect' })
    }
  } else {
    res.send({ error: 'Sorry no anonoymous or unauthorised access allowed to this page'})
  }
}