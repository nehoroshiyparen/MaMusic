import { Request, Response } from "express";
import { ApiError } from "shared/common/utils/ApiError/api-error";
import { sendError, sendResponse } from "shared/common/utils/http";
import { TrackService } from "src/services/tracks.service";

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
            const id = req.params

            const track = await this.trackService.fetchTrack(Number(id))

            sendResponse(res, 200, 'Track fetched', track)
        } catch (e) {
            sendError(res, e)
        }
    }
}