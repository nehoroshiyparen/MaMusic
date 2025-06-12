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
            
            const validatedPlaylistId = isNumber.safeParse(playlist_id)

            if (!validatedPlaylistId.success) {
                throw validatedPlaylistId.error
            }

            const playlist = await this.playlistService.fetchPlaylist(validatedPlaylistId.data)

            sendResponse(res, 200, 'Playlist fetched', playlist)
        } catch (e) {
            sendError(res, e)
        }
    }

    async fetchUserLikedPlaylists(req: Request, res: Response) {
        try {
            const user_id = Number(req.query.user_id)
                ?? req.headers['x-user-id']
                ?? (() => { throw ApiError.BadRequest('User ID not found in params', 'INVALID_REQUEST_PARAMS') })()

            const validatedUserId = isNumber.safeParse(user_id)

            if (!validatedUserId.success) {
                throw validatedUserId.error
            }
            
            const likedPlaylists = await this.playlistService.fetchUserLikedPlaylists(validatedUserId.data)

            sendResponse(res, 200, 'Liked playlists fetched', likedPlaylists)
        } catch (e) {
            sendError(res, e)
        }
    }

    async createPlaylist(req: Request, res: Response) {
        try {
            const playlistDtoRaw = req.body
            const user_id = Number(req.headers['x-user-id'])

            const playlistDtoValidated = createPlaylistSchema.safeParse(playlistDtoRaw)

            if (!playlistDtoValidated.success) {
                throw playlistDtoValidated.error
            }

            const url = await this.playlistService.createPlaylist(playlistDtoValidated.data, user_id)

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

            const validatedPatch = updatePlaylistSchema.safeParse(patch)

            if (!validatedPatch.success) {
                throw validatedPatch.error
            }

            await this.playlistService.updatePlaylist(user_id, playlist_id, validatedPatch.data)

            sendResponse(res, 200, 'Playlist updated')
        } catch (e) {
            sendError(res, e)
        }
    }

    async likePlaylist(req: Request, res: Response) {
        try {
            const user_id = Number(req.headers['x-user-id'])

            const playlist_id = Number(req.params.playlist_id)

             const validatedPlaylistId = isNumber.safeParse(playlist_id)

            if (!validatedPlaylistId.success) {
                throw validatedPlaylistId.error
            }

            await this.playlistService.likePlaylist(user_id, validatedPlaylistId.data)

            sendResponse(res, 200, 'Playlist liked')
        } catch (e) {
            sendError(res, e)
        }
    }

    async dislikePlaylist(req: Request, res: Response) {
        try {
            const user_id = Number(req.headers['x-user-id'])

            const playlist_id = Number(req.params.playlist_id)

            const validatedPlaylistId = isNumber.safeParse(playlist_id)

            if (!validatedPlaylistId.success) {
                throw validatedPlaylistId.error
            }

            await this.playlistService.dislikePlaylist(user_id, validatedPlaylistId.data)

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

            const validatedDto = addTrackToPlaylistSchema.safeParse({ playlist_id, track_id})

            if (!validatedDto.success) {
                throw validatedDto.error
            }

            await this.playlistService.addTrackToPlaylist(validatedDto.data.playlist_id, validatedDto.data.track_id, user_id)

            sendResponse(res, 200, 'Track added to playlist')
        } catch (e) {
            sendError(res, e)
        }
    }

    async deleteTrackFromPlaylist(req: Request, res: Response) {
        try {
            const playlist_id = Number(req.params.playlist_id)
            const { track_id } = req.body
            const user_id = Number(req.headers['x-user-id'])

                        const validatedDto = addTrackToPlaylistSchema.safeParse({ playlist_id, track_id})

            if (!validatedDto.success) {
                throw validatedDto.error
            }

            await this.playlistService.deleteTrackFromPlaylist(validatedDto.data.playlist_id, validatedDto.data.track_id, user_id)

            sendResponse(res, 200, 'Track deleted from playlist')
        } catch (e) {
            sendError(res, e)
        }
    }

    async deletePlaylist(req: Request, res: Response) {
        try {
            const user_id = Number(req.headers['x-user-id'])

            const playlist_id = Number(req.params.playlist_id)

            const validatedPlaylistId = isNumber.safeParse(playlist_id)

            if (!validatedPlaylistId.success) {
                throw validatedPlaylistId.error
            }

            await this.playlistService.deletePlaylist(user_id, validatedPlaylistId.data)

            sendResponse(res, 200, 'Playlist deleted')
        } catch (e) {
            sendError(res, e)
        }
    }
}