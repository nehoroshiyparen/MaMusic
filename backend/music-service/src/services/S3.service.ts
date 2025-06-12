import { DeleteObjectCommand, PutObjectCommand, S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { ApiError } from 'shared/common/utils/ApiError/api-error'

export class S3Service {
    constructor(
        private s3: S3Client,
        private BucketName: string,
    ) {

    }

    async sendObjectS3(key: string, body: Buffer, mimetype: string): Promise<void> {
        try {
            await this.s3.send(
                new PutObjectCommand({
                    Bucket: this.BucketName,
                    Key: key,
                    Body: body,
                    ContentType: mimetype,
                })
            )
        } catch (e) {
            throw ApiError.Internal('Entity creating error', 'S3_ENTITY_CREATE_ERROR')
        }
    }

    async deleteFromS3(key: string): Promise<void> {
        try {
            await this.s3.send(
                new DeleteObjectCommand({
                    Bucket: this.BucketName,
                    Key: key
                })
            )
        } catch (e) {
            throw ApiError.Internal('Error while deleting track from s3', 'S3_DELETE_TRACK_ERROR')
        }
    }

    generateS3Key(folder: string, identifier: string | number, filename: string): string {
        return `${folder}/${identifier}_${filename}`
    }

    async getStreamByRange(key: string, byteRange: string) {
        try {
            const response = await this.s3.send(
                new GetObjectCommand({
                    Bucket: this.BucketName,
                    Key: key,
                    Range: byteRange
                })
            )

            return response
        } catch (e) {
            throw ApiError.Internal('Stream fetch error', 'S3_STREAM_FETCH_ERROR', e)
        }
    }
}