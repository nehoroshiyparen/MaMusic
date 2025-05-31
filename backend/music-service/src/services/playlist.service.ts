import { Op, Sequelize } from "sequelize";
import { ApiError } from "shared/common/utils/ApiError/api-error";
import { rethrowAsApiError } from "shared/common/utils/ApiError/rethrowApiError";
import Playlist from "src/config/db/modeles/Playlist.model";
import Playlist_Tracks from "src/config/db/modeles/Playlist_Tracks.model";
import Track from "src/config/db/modeles/Track.model";
import { AddTrackToPlaylistDto } from "src/dto/playlist/addTrackToPlaylist.dto";
import { CreatePlaylistDto } from "src/dto/playlist/createPlaylist.dto";
import { PlaylistRepository } from "src/repositories/playlist.repository";
import { CreatePlaylistRespose } from "src/responses/playlists/createPlaylist.reponse";
import { createPlaylistLink } from "src/utils/urlBuilders/urlFactory";
import { PlaylistValidator } from "src/validators/playlist.validator";
import { TrackValidator } from "src/validators/track.validator";

export class PlaylistService {
    constructor(
        private sequelize: Sequelize,
        private playlistValidator: PlaylistValidator,
        private trackValidator: TrackValidator,
        private playlistRepository: PlaylistRepository,
    ) {}

    // С самого начала создается дефолтный плейлист. Позже он дополняется
    // В дто - объект track с айди единственного трека, который будет в плейлисте
    async createPlaylist(playlistDto: CreatePlaylistDto, user_id: number): Promise<CreatePlaylistRespose> {
        const transaction = await this.sequelize.transaction()
        try {
            const url = createPlaylistLink()

            const playlist = await Playlist.create({
                owner_id: user_id,
                url
            }, {transaction})

            const track = await Track.findOne({
                where: { id: playlistDto.track.id }
            })

            if (!track) {
                throw ApiError.NotFound('There is no track with this ID', 'NO_TRACK_FOUND')
            }

            await Playlist_Tracks.create({
                playlist_id: playlist.id,
                track_id: track.id,
                order: 1
            }, {transaction})

            await transaction.commit()
            return { url }
        } catch (e) {
            await transaction.rollback()
            throw rethrowAsApiError('Playlist create error', 'PLAYLIST_CREATE_ERROR', e)
        }
    }

    async addTrackToPlaylist(playlist_id: number, track_id: number, user_id: number) {
        const playlist = await this.playlistValidator.ensurePlaylistExists(playlist_id)
        this.playlistValidator.ensureUserCanEdit(user_id, playlist)

        await this.trackValidator.ensureTrackExists(track_id)

        const maxOrder = await this.playlistRepository.getMaxOrder(playlist_id)
        const nextOrderNumber = maxOrder ? maxOrder : 1

        await this.playlistRepository.addTrack(playlist_id, track_id, nextOrderNumber)

        return { success: true }
    }

    async deleteTrackFromPlaylist(playlist_id: number, track_id: number, user_id: number) {
        const playlist = await this.playlistValidator.ensurePlaylistExists(playlist_id)
        this.playlistValidator.ensureUserCanEdit(user_id, playlist)

        await this.trackValidator.ensureTrackExists(track_id)

        const trackRow = await this.playlistValidator.ensureTrackInPlaylist(playlist_id, track_id)

        await this.playlistRepository.removeTrack(playlist_id, track_id)

        await this.playlistRepository.decrementOrederAfter(playlist_id, trackRow.order)

        return { success: true }
    }
}