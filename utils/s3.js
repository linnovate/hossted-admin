const s3 = require('@aws-sdk/client-s3')
const csv=require('csvtojson')


const streamToString = (stream) =>
new Promise((resolve, reject) => {
  const chunks = [];
  stream.on("data", (chunk) => chunks.push(chunk));
  stream.on("error", reject);
  stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });


function getClient() {
  const client = new s3.S3Client({
    credentials: {
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey
    },
    region: 'us-east-2'
  });
  return client
}

async function getData(s3Key) {
  const client = getClient()
  const command = new s3.GetObjectCommand({
      Bucket: 'hossted-test-reports',
      Key: s3Key
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



module.exports.getObjectCsv = async function getObjectCsv(s3Key) {
    let data = await getData(s3Key)
    data = await getCsv(data)
    return data
}

module.exports.getObjectJson = async function getObjectCsv(s3Key) {
  let data = await getData(s3Key)
  data = JSON.parse(data)
  return data
}



module.exports.listBucket = async function listBucket(bucket) {
  const client = getClient()
  const command = new s3.ListObjectsCommand({Bucket: bucket})
  const res = await client.send(command)
  return res
}
