import { Sequelize } from "sequelize";
import { ApiError } from "shared/common/utils/ApiError/api-error";
import Playlist from "src/config/db/modeles/Playlist.model";
import Playlist_Tracks from "src/config/db/modeles/Playlist_Tracks.model";
import { PlaylistRepository } from "src/repositories/playlist.repository";

export class PlaylistAssertions {
    constructor(
        private sequelize: Sequelize,
        private playlistRepository: PlaylistRepository,
    ) {}

    async ensurePlaylistExists(playlist_id:number): Promise<Playlist> {
        const playlist = await Playlist.findOne({
            where: { id: playlist_id },
            attributes: ['owner_id']
        })

        if (!playlist) {
            throw ApiError.NotFound('Playlist does not exists', 'PLAYLIST_DOES_NOT_EXISTS')
        }

        return playlist
    }

    async ensureTrackInPlaylist(playlist_id: number, track_id: number): Promise<Playlist_Tracks> {
        const trackRow = await this.playlistRepository.findTrackInPlaylist(playlist_id, track_id)

        if (!trackRow) {
            throw ApiError.NotFound('Track is not in playlist', 'TRACK_NOT_IN_PLAYLIST')
        }

        return trackRow
    }

    ensureUserCanEdit(user_id: number, playlist: Playlist): void {
        if (playlist.owner_id !== user_id) {
            throw ApiError.NoAccess('No righs for editing playlist', 'NO_RIGHTS_FOR_EDITING_PLAYLIST')
        }
    }
}