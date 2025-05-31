import { Op } from "sequelize";
import Playlist_Tracks from "src/config/db/modeles/Playlist_Tracks.model";

export class PlaylistRepository {
    constructor(

    ) {}

    async findTrackInPlaylist(playlist_id: number, track_id: number): Promise<Playlist_Tracks | null> {
        return Playlist_Tracks.findOne({
            where: { playlist_id, track_id }
        })
    }

    async addTrack(playlist_id: number, track_id:number, order: number): Promise<Playlist_Tracks> {
        return Playlist_Tracks.create({
            playlist_id,
            track_id,
            order
        })
    }

    async removeTrack(playlist_id: number, track_id: number): Promise<void> {
        Playlist_Tracks.destroy({
            where: {
                playlist_id,
                track_id
            }
        })
    }

    /**
     * Возвращает максимальный order для треков в плейлисте.
     */
    async getMaxOrder(playlist_id: number): Promise<number> {
        const maxOrder = await Playlist_Tracks.findOne({
            where: { playlist_id },
            attributes: ['order'],
            order: ['order', 'DESC']
        })

        return maxOrder?.order || 0
    }

    /**
     * Уменьшает order после удаления трека
     * @param playlist_id 
     * @param order - ордер удаленного трека
     */
    async decrementOrederAfter(playlist_id: number, order: number): Promise<void> {
        Playlist_Tracks.increment(
            { order: -1 },
            { 
                where: {
                    playlist_id,
                    order: {
                        [Op.gt]: order
                    }
                }
            }
        )
    }
}