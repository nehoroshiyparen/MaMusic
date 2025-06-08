import { Request, Response } from "express";
import { ApiError } from "shared/common/utils/ApiError/api-error";
import { sendError, sendResponse } from "shared/common/utils/http";
import { StreamService } from "src/services/stream.service";
import { TrackService } from "src/services/tracks.service";
import { toNodeReadable } from "src/utils/stream";

export class StreamController {
    constructor (
        private streamService: StreamService
    ) {}

    async getStream(req: Request, res: Response) {
        try {
            const track_id = Number(req.params.id)
            const range = req.headers.range

            if (!range) return sendError(res, ApiError.BadRequest('Range requered', 'RANGE_REQUERED'))

            const response = await this.streamService.getStream(track_id, range)

            res.writeHead(206, {
                'Content-Range': Number(response.ContentRange),
                'Accept-Ranges': 'bytes',
                'Content-Length': response.ContentLength,
                'Content-Type': response.ContentType || 'audio/mpeg'
            })

            const stream = toNodeReadable(response.Body)

            if (stream) {
                stream.pipe(res)
            } else {
                sendError(res, ApiError.Internal('Converting stream error', 'STREAM_CONVERT_ERROR'))
            }
        } catch (e) {
            sendError(res, e)
        }
    }
}