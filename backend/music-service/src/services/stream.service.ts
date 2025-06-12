import { rethrowAsApiError } from "shared/common/utils/ApiError/rethrowApiError";
import { S3Service } from "./S3.service";
import { TrackService } from "./tracks.service";

export class StreamService {
    constructor(
        private trackService: TrackService,
        private s3Service: S3Service,
    ) {}

    async getStream(track_id: number, range: string) {
        try {
            const track = await this.trackService.fetchTrack(track_id)

            const [startStr, endStr] = range.replace(/bytes=/, '').split('-')
            const start = parseInt(startStr, 10)
            const end = endStr ? parseInt(endStr, 10) : undefined

            const byteRange = `bytes=${start}-${end ?? ''}`

            const response = await this.s3Service.getStreamByRange(track.file_key, byteRange)

            return response
        }
        catch (e) {
            rethrowAsApiError('Stream fetch error', 'STREAM_FETCH_ERROR', e)
        }
    }
}