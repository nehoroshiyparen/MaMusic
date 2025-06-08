import { DeleteObjectCommand, PutObjectCommand, S3Client, GetObjectCommand } from '@aws-sdk/client-s3'

export class S3Service {
    constructor(
        private s3: S3Client,
        private BucketName: string,
    ) {

    }

    async sendObjectS3(key: string, body: Buffer, mimetype: string): Promise<void> {
        await this.s3.send(
            new PutObjectCommand({
                Bucket: this.BucketName,
                Key: key,
                Body: body,
                ContentType: mimetype,
            })
        )
    }

    async deleteFromS3(key: string): Promise<void> {
        await this.s3.send(
            new DeleteObjectCommand({
                Bucket: this.BucketName,
                Key: key
            })
        )
    }

    generateS3Key(folder: string, identifier: string | number, filename: string): string {
        return `${folder}/${identifier}_${filename}`
    }

    async getStreamByRange(key: string, byteRange: string) {
        const response = await this.s3.send(
            new GetObjectCommand({
                Bucket: this.BucketName,
                Key: key,
                Range: byteRange
            })
        )

        return response
    }
}