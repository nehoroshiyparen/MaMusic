import { Request, Response } from "express";
import { ApiError } from "shared/common/utils/ApiError/api-error";
import { sendError, sendResponse } from "shared/common/utils/http";
import { AddTrackToPlaylistDto, addTrackToPlaylistSchema } from "src/dto/playlist/addTrackToPlaylist.dto";
import { CreatePlaylistDto, createPlaylistSchema } from "src/dto/playlist/createPlaylist.dto";
import { DeleteTrackFromPlaylistDto, deleteTrackFromPlaylistSchema } from "src/dto/playlist/deleteTrackFromPlaylist.dto";
import { PlaylistService } from "src/services/playlist.service";

export class PlaylistController {
    constructor (
        private playlistService: PlaylistService,
    ) {}

    async createPlaylist(req: Request, res: Response) {
        try {
            const playlistDtoRaw = req.body
            const user_id = req.headers['x-user-id']

            if (!user_id) {
                throw ApiError.BadRequest('User ID not provided', 'NO_USER_ID')
            }

            const playlistDtoValidated: CreatePlaylistDto = createPlaylistSchema.parse(playlistDtoRaw)

            const url = await this.playlistService.createPlaylist(playlistDtoValidated, Number(user_id))

            sendResponse(res, 200, 'Playlist created', url)
        } catch (e) {
            sendError(res, e)
        }
    }

    async addTrackToPlaylist(req: Request, res: Response) {
        try {
            const playlist_id = Number(req.params.id)
            const { track_id } = req.body
            const user_id = Number(req.headers['x-user-id'])

            const validatedDto: AddTrackToPlaylistDto = addTrackToPlaylistSchema.parse({ playlist_id, track_id})

            const result = await this.playlistService.addTrackToPlaylist(validatedDto.playlist_id, validatedDto.track_id, user_id)

            sendResponse(res, 200, 'Track added', result)
        } catch (e) {
            sendError(res, e)
        }
    }

    async deleteTrackFromPlaylist(req: Request, res: Response) {
        try {
            const playlist_id = Number(req.params.playlsit_id)
            const track_id = Number(req.params.track_id)
            const user_id = Number(req.headers['x-user-id'])

            const validatedDto: DeleteTrackFromPlaylistDto = deleteTrackFromPlaylistSchema.parse({ playlist_id, track_id })

            const result = await this.playlistService.deleteTrackFromPlaylist(validatedDto.playlist_id, validatedDto.track_id, user_id)

            sendResponse(res, 200, 'Track deleted', result)
        } catch (e) {
            sendError(res, e)
        }
    }
}