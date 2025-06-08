import { Op, Sequelize } from "sequelize";
import { ApiError } from "shared/common/utils/ApiError/api-error";
import { rethrowAsApiError } from "shared/common/utils/ApiError/rethrowApiError";
import { CreatePlaylistDto } from "src/dto/playlist/createPlaylist.dto";
import { PlaylistRepository } from "src/repositories/playlist.repository";
import { CreatePlaylistRespose } from "src/responses/playlists/createPlaylist.reponse";
import { createPlaylistLink } from "src/utils/urlBuilders/urlFactory";
import { PlaylistAssertions } from "src/assertions/playlist.assertions";
import { TrackService } from "./tracks.service";
import { UpdatePlaylistDto } from "src/dto/playlist/updatePlaylist.dto";

export class PlaylistService {
    constructor(
        private sequelize: Sequelize,
        private playlistAssertions: PlaylistAssertions,
        private playlistRepository: PlaylistRepository,
        private trackService: TrackService,
    ) {}

    async fetchPlaylist(playlist_id: number) {
        try {
            await this.playlistAssertions.ensurePlaylistExists(playlist_id)
            const playlist = await this.playlistRepository.fetchPlaylist(playlist_id)
            return playlist
        } catch (e) {
            rethrowAsApiError('Error while fetching playlist', 'PLAYLIST_FETCH_ERROR', e)
        }
    }

    async fetchUserLikedPlaylists(user_id: number) {
        try {
            const likedPlaylists = await this.playlistRepository.fetchUserLikedPlaylists(user_id)
            return likedPlaylists
        } catch (e) {
            rethrowAsApiError('Error while fetching users playlists', 'PLAYLISTS_FETCH_ERROR', e)
        }
    }

    // С самого начала создается дефолтный плейлист. Позже он дополняется
    // В дто - объект track с айди единственного трека, который будет в плейлисте
    async createPlaylist(playlistDto: CreatePlaylistDto, user_id: number): Promise<CreatePlaylistRespose> {
        const transaction = await this.sequelize.transaction()
        try {
            const url = createPlaylistLink()

            const playlist = await this.playlistRepository.createPlaylist(user_id, url, transaction)

            console.log(playlist.id)

            await this.playlistRepository.likePlaylist(user_id, playlist.id, transaction)

            const track = await this.trackService.fetchTrack(playlistDto.track.id)

            await this.playlistRepository.addTrack(playlist.id, track.id, 1, transaction)

            await transaction.commit()
            return { url }
        } catch (e) {
            await transaction.rollback()
            throw rethrowAsApiError('Playlist create error', 'PLAYLIST_CREATE_ERROR', e)
        }
    }

    async likePlaylist(user_id: number, playlist_id: number) {
        try {
            await this.playlistAssertions.ensurePlaylistExists(playlist_id)
            await this.playlistAssertions.ensurePlaylistDoNotLiked(user_id, playlist_id)

            await this.playlistRepository.likePlaylist(user_id, playlist_id)
        } catch (e) {
            rethrowAsApiError('Error while liking playlist', 'PLAYLIST_LIKE_ERROR', e)
        }
    }

    async dislikePlaylist(user_id: number, playlist_id: number) {
        try {
            await this.playlistAssertions.ensurePlaylistExists(playlist_id)
            await this.playlistAssertions.ensurePlaylistLiked(user_id, playlist_id)

            await this.playlistRepository.dislikePlaylist(user_id, playlist_id)
        } catch (e) {
            rethrowAsApiError('Error while displiking playlist', 'PLAYLIST_DISLIKE_ERROR', e)
        }
    }

    async updatePlaylist(user_id: number, playlist_id: number, patch: UpdatePlaylistDto) {
        try {
            const playlist = await this.playlistAssertions.ensurePlaylistExists(playlist_id)
            await this.playlistAssertions.ensureUserCanEdit(user_id, playlist)

            await this.playlistRepository.updatePlaylist(playlist, patch)
        } catch (e) {
            rethrowAsApiError('Error while updating playlist', 'PLAYLIST_UPDATE_ERROR', e)
        }
    }

    async addTrackToPlaylist(playlist_id: number, track_id: number, user_id: number) {
        try {
            const playlist = await this.playlistAssertions.ensurePlaylistExists(playlist_id)
            this.playlistAssertions.ensureUserCanEdit(user_id, playlist)

            const track = await this.trackService.fetchTrack(track_id)

            if (!track) {
                throw ApiError.NotFound('Track does not exists', 'TRACK_DOES_NOT_EXISTS')
            }

            const maxOrder = await this.playlistRepository.getMaxOrder(playlist_id)
            const nextOrderNumber = maxOrder ? maxOrder + 1 : 1

            await this.playlistRepository.addTrack(playlist_id, track_id, nextOrderNumber)
        } catch (e) {
            throw rethrowAsApiError('Error while pulling track into playlist', 'ADD_TRACK_TO_PLAYLIST_ERROR', e)
        }
    }

    async deleteTrackFromPlaylist(playlist_id: number, track_id: number, user_id: number) {
        try {
            const playlist = await this.playlistAssertions.ensurePlaylistExists(playlist_id)
            this.playlistAssertions.ensureUserCanEdit(user_id, playlist)

            const track = await this.trackService.fetchTrack(track_id)

            if (!track) {
                throw ApiError.NotFound('Track does not exists', 'TRACK_DOES_NOT_EXISTS')
            }

            const trackRow = await this.playlistAssertions.ensureTrackInPlaylist(playlist_id, track_id)

            await this.playlistRepository.removeTrack(playlist_id, track_id)

            await this.playlistRepository.decrementOrederAfter(playlist_id, trackRow.order)

            return { success: true }
        } catch (e) {
            throw rethrowAsApiError('Error while removing track from playlist', 'REMOVE_TRACK_FROM_PLAYLIST_ERROR', e)
        }
    }

    async deletePlaylist(user_id: number, playlist_id: number) {
        try {
            const playlist = await this.playlistAssertions.ensurePlaylistExists(playlist_id)

            await this.playlistAssertions.ensureUserCanEdit(user_id, playlist)

            await this.playlistRepository.deletePlaylist(playlist_id)
        } catch (e) {
            rethrowAsApiError('Error while deleting playlist', 'PLAYLIST_DELETE_ERROR', e)
        }
    }
}