const AWS = require('aws-sdk');
const fs = require('fs');
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

async function uploadFile(localPath, bucketKey) {
  const data = fs.readFileSync(localPath);
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: bucketKey,
    Body: data,
  };
  const r = await s3.upload(params).promise();
  return r.Location;
}

module.exports = { uploadFile };
