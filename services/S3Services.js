const AWS = require('aws-sdk')


const uploadToS3 = (data, fileName) => {
    return new Promise((resolve, reject) => {
        const BUCKET = process.env.BUCKET
        const IAM_USER_KEY = process.env.IAM_USER_KEY
        const IAM_USER_SECRET = process.env.IAM_USER_SECRET
        const s3bucket = new AWS.S3({
            accessKeyId: IAM_USER_KEY,
            secretAccessKey: IAM_USER_SECRET
        })
        const params = {
            Bucket: BUCKET,
            Key: fileName,
            Body: data,
            ACL: 'public-read'
        }
        s3bucket.upload(params, (err, s3response) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(s3response)
            }
        })
    })
}

module.exports = {
    uploadToS3
}