import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSession } from 'next-auth/client'

const csv=require('csvtojson')


const streamToString = (stream) =>
new Promise((resolve, reject) => {
  const chunks = [];
  stream.on("data", (chunk) => chunks.push(chunk));
  stream.on("error", reject);
  stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
});


async function getData() {
  const client = new S3Client({
    credentials: {
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey
    },
    region: 'us-east-2'
  });
  const command = new GetObjectCommand({
      Bucket: 'hossted-test-reports',
      Key: 'from-node/daily_business_usage_by_instance_type_2021-08-08.csv'
  })
  try {
    const res = await client.send(command);
    const bodyContents = await streamToString(res.Body)
    return bodyContents

  } catch (error) {
    console.log(error)
  } 
}


async function getCsv(data) {
    return csv({
    })
    .fromString(data)
}



export default async (req, res) => {
  const session = await getSession({ req })

  if (session){
    const domain = session.user.email.split('@')[1];
    if (domain === 'linnovate.net') {
        let data = await getData()
        data = await getCsv(data)
        res.send({ data: data})
    } else {
      res.send({ error: domain + 'is not allowed to connect' })
    }
  } else {
    res.send({ error: 'Sorry no anonoymous or unauthorised access allowed to this page'})
  }
}
