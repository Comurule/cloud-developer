import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
export class AttachmentUtils {
    constructor(
        private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,
    ) { }

    getAttachmentUrl(attachmentId: string): string {
        return `https://${this.bucketName}.s3.amazonaws.com/${attachmentId}`
    }

    getUploadUrl(attachmentId: string): string {
        const Bucket = this.bucketName,
            Expires = this.urlExpiration,
            Key = attachmentId;

        return this.s3.getSignedUrl('putObject', { Bucket, Key, Expires })
    }
}