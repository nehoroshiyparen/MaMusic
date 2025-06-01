import { Request, Response } from "express";
import { ApiError } from "shared/common/utils/ApiError/api-error";
import { sendError, sendResponse } from '../../../shared/common/utils/http'
import { UploadService } from "src/services/upload.service";
import { MulterFileArray } from "src/types/MulterFile.interface";
import { logInfo } from "shared/common/utils/logger/logger";
import { CreateTrackSchema } from "src/dto/createTrack.dto";

export class UploadController {
    constructor(
        private uploadService: UploadService
    ) {}

    uploadTrack = async(req: Request, res: Response) => {
        const correlationId = req.headers['x-correlation-id'] as string
        try {
            const files = req.files as MulterFileArray

            const track = files['track']?.[0]
            const cover = files['cover']?.[0]

            const track_settings = JSON.parse(req.body.track_settings)

            const validatedSettings = CreateTrackSchema.safeParse(track_settings)

            if (!validatedSettings.success) {
                logInfo('Invalid data of the track')
                throw ApiError.BadRequest('Invalid data of the track', 'INVALID_TRACK_DATA')
            }

            const user_id = Number(req.headers['x-user-id'])

            if (!track) throw ApiError.BadRequest('No file found', 'NO_FILE_FOUND')
            
            const urls = await this.uploadService.uploadTrack(track, user_id, validatedSettings.data, cover)

            logInfo(`Track uploaded: ${urls.trackUrl}`, correlationId)
            sendResponse(res, 201, 'track uploaded', urls)
        } catch (e) {
            sendError(res, e)
        }
    }
}