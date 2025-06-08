import { Readable } from "stream";
import { GetObjectCommandOutput } from '@aws-sdk/client-s3';

export function toNodeReadable(body:  GetObjectCommandOutput['Body'] ): Readable | null {
     if (body && typeof body === 'object' && 'pipe' in body && typeof body.pipe === 'function') {
        return body as Readable
    }

    return null
}