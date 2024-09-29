import AWS = require('aws-sdk')

interface S3UploadResponse {
    ETag: string;
    Location: string;
    Key: string;
    Bucket: string;
}

export const uploadToS3 = (data: Buffer | string, fileName: string): Promise<S3UploadResponse> => {
    return new Promise((resolve, reject) => {
        const BUCKET = process.env.BUCKET as string
        const IAM_USER_KEY = process.env.IAM_USER_KEY as string
        const IAM_USER_SECRET = process.env.IAM_USER_SECRET as string
        const s3bucket = new AWS.S3({
            accessKeyId: IAM_USER_KEY,
            secretAccessKey: IAM_USER_SECRET
        })
        const params: AWS.S3.PutObjectRequest = {
            Bucket: BUCKET,
            Key: fileName,
            Body: data,
            ACL: 'public-read'
        }
        s3bucket.upload(params, (err: Error, s3response: AWS.S3.ManagedUpload.SendData) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(s3response as S3UploadResponse)
            }
        })
    })
}

