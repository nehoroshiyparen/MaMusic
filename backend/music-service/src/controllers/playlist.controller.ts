import { Request, Response } from "express";
import { ApiError } from "shared/common/utils/ApiError/api-error";
import { rethrowAsApiError } from "shared/common/utils/ApiError/rethrowApiError";
import { sendError, sendResponse } from "shared/common/utils/http";
import { AddTrackToPlaylistDto, addTrackToPlaylistSchema } from "src/dto/playlist/addTrackToPlaylist.dto";
import { CreatePlaylistDto, createPlaylistSchema } from "src/dto/playlist/createPlaylist.dto";
import { DeleteTrackFromPlaylistDto, deleteTrackFromPlaylistSchema } from "src/dto/playlist/deleteTrackFromPlaylist.dto";
import { updatePlaylistSchema } from "src/dto/playlist/updatePlaylist.dto";
import { PlaylistService } from "src/services/playlist.service";
import { isNumber } from "src/utils/validators/isNumber.validator";
import { ZodError } from "zod";

export class PlaylistController {
    constructor (
        private playlistService: PlaylistService,
    ) {}

    async fetchPlaylist(req: Request, res: Response) {
        try {
            const playlist_id = Number(req.params.playlist_id)
            
            const validatedPlaylistId = isNumber.parse(playlist_id)

            const playlist = await this.playlistService.fetchPlaylist(validatedPlaylistId)

            sendResponse(res, 200, 'Playlist fetched', playlist)
        } catch (e) {
            sendError(res, e)
        }
    }

    async fetchUserLikedPlaylists(req: Request, res: Response) {
        try {
            const user_id = Number(req.params.user_id)
                ?? req.headers['x-user-id']
                ?? (() => { throw ApiError.BadRequest('User ID not found', 'NO_USER_ID') })()

            const validatedUserId = isNumber.parse(user_id)
            
            const likedPlaylists = await this.playlistService.fetchUserLikedPlaylists(validatedUserId)

            sendResponse(res, 200, 'Liked playlists fetched', likedPlaylists)
        } catch (e) {
            sendError(res, e)
        }
    }

    async createPlaylist(req: Request, res: Response) {
        try {
            const playlistDtoRaw = req.body
            const user_id = Number(req.headers['x-user-id'])

            if (!user_id) {
                throw ApiError.BadRequest('User ID not provided', 'NO_USER_ID')
            }

            const playlistDtoValidated: CreatePlaylistDto = createPlaylistSchema.parse(playlistDtoRaw)

            const url = await this.playlistService.createPlaylist(playlistDtoValidated, user_id)

            sendResponse(res, 200, 'Playlist created', url)
        } catch (e) {
            sendError(res, e)
        }
    }

    async updatePlaylist(req: Request, res: Response) {
        try {
            const user_id = Number(req.headers['x-user-id'])
            const playlist_id = Number(req.params.playlist_id)
            const { patch } = req.body

            const validatedPatch = updatePlaylistSchema.parse(patch)

            await this.playlistService.updatePlaylist(user_id, playlist_id, validatedPatch)

            sendResponse(res, 200, 'Playlist updated')
        } catch (e) {
            sendError(res, e)
        }
    }

    async likePlaylist(req: Request, res: Response) {
        try {
            const user_id = Number(req.headers['x-user-id'])

            const playlist_id = Number(req.params.playlist_id)

            const validatedPlaylistId = isNumber.parse(playlist_id)

            await this.playlistService.likePlaylist(user_id, validatedPlaylistId)

            sendResponse(res, 200, 'Playlist liked')
        } catch (e) {
            sendError(res, e)
        }
    }

    async dislikePlaylist(req: Request, res: Response) {
        try {
            const user_id = Number(req.headers['x-user-id'])

            const playlist_id = Number(req.params.playlist_id)

            const validatedPlaylistId = isNumber.parse(playlist_id)

            await this.playlistService.dislikePlaylist(user_id, validatedPlaylistId)

            sendResponse(res, 200, 'Playlist disliked')
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
            const playlist_id = Number(req.params.playlist_id)
            const { track_id } = req.body
            const user_id = Number(req.headers['x-user-id'])

            console.log(track_id)

            const validatedDto: DeleteTrackFromPlaylistDto = deleteTrackFromPlaylistSchema.parse({ playlist_id, track_id })

            const result = await this.playlistService.deleteTrackFromPlaylist(validatedDto.playlist_id, validatedDto.track_id, user_id)

            sendResponse(res, 200, 'Track deleted', result)
        } catch (e) {
            sendError(res, e)
        }
    }

    async deletePlaylist(req: Request, res: Response) {
        try {
            const user_id = Number(req.headers['x-user-id'])

            const playlist_id = Number(req.params.playlist_id)

            const validatedPlaylistId = isNumber.parse(playlist_id)

            await this.playlistService.deletePlaylist(user_id, validatedPlaylistId)

            sendResponse(res, 200, 'Playlist deleted')
        } catch (e) {
            sendError(res, e)
        }
    }
}