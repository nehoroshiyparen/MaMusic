import { Request, Response } from "express";
import { ApiError } from "shared/common/utils/ApiError/api-error";
import { sendError, sendResponse } from "shared/common/utils/http";
import { TrackService } from "src/services/tracks.service";
import { isNumber } from "src/utils/validators/isNumber.validator";

export class TrackController {
    constructor(
        private trackService: TrackService,
    ) {}

    async fetchUserLikedTracks(req: Request, res: Response) {
        try {
            const user_id = req.params.user_id
                ?? req.headers['x-user-id']
                ?? (() => { throw ApiError.BadRequest('User ID not found', 'NO_USER_ID') })()
            
            const { limit, offset } = req.params

            const likedTracks = await this.trackService.fetchUserLikedTracks(Number(user_id), Number(limit), Number(offset))

            sendResponse(res, 200, 'Tracks fetched', likedTracks)
        } catch (e) {
            sendError(res, e)
        }
    }

    async fetchTrack(req: Request, res: Response) {
        try {
            const track_id = Number(req.params.track_id)

            const validatedTrackId = isNumber.parse(track_id)

            const track = await this.trackService.fetchTrack(validatedTrackId)

            sendResponse(res, 200, 'Track fetched', track)
        } catch (e) {
            sendError(res, e)
        }
    }

    async likeTrack(req: Request, res: Response) {
        try {
            const user_id = Number(req.headers['x-user-id'])
            const track_id = Number(req.params.track_id)

            const validatedTrackId = isNumber.parse(track_id)

            await this.trackService.likeTrack(user_id, validatedTrackId)

            sendResponse(res, 200, 'Track liked')
        } catch (e) {
            sendError(res, e)
        }
    }

    async deleteTrack(req: Request, res: Response) {
        try {
            const track_id = Number(req.params.track_id)

            const validatedTrackId = isNumber.parse(track_id)

            await this.trackService.deleteTrack(validatedTrackId)

            sendResponse(res, 200, 'Track deleted')
        } catch (e) {
            sendError(res, e)
        }
    }
}