const AWS = require('aws-sdk');
const fs = require('fs').promises;

const ID = process.env.AWS_ID;
const SECRET = process.env.AWS_SECRET;


const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
  region: 'us-west-1',
});

const uploadImage = async (file) => {
  const data = await fs.readFile(file.path);

  const s3Pparams = {
    Bucket: 'my-campus-photos',
    Key: file.originalname,
    Body: data,
  };

  const s3Data = await s3.upload(s3Pparams).promise();

  return s3Data.Location;
};

module.exports = uploadImage;
