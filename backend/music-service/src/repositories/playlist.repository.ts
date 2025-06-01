import { Op, Transaction } from "sequelize";
import Playlist from "src/config/db/modeles/Playlist.model";
import Playlist_Tracks from "src/config/db/modeles/Playlist_Tracks.model";

export class PlaylistRepository {
    constructor(

    ) {}

    async findTrackInPlaylist(playlist_id: number, track_id: number): Promise<Playlist_Tracks | null> {
        return await Playlist_Tracks.findOne({
            where: { playlist_id, track_id }
        })
    }

    async createPlaylist(owner_id: number, url: string, transaction?: Transaction): Promise<Playlist> {
        const playlist = await Playlist.create({
            owner_id,
            url
        }, transaction ? { transaction } : undefined)

        return playlist
    }

    async addTrack(playlist_id: number, track_id:number, order: number, transaction?: Transaction): Promise<Playlist_Tracks> {
        return await Playlist_Tracks.create({
            playlist_id,
            track_id,
            order
        }, transaction ? { transaction } : undefined)
    }

    async removeTrack(playlist_id: number, track_id: number, transaction?: Transaction): Promise<void> {
        await Playlist_Tracks.destroy({
            where: {
                playlist_id,
                track_id
            },
            ...(transaction ? { transaction } : undefined)
        })
    }

    /**
     * Возвращает максимальный order для треков в плейлисте.
     */
    async getMaxOrder(playlist_id: number, transaction?: Transaction): Promise<number> {
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
    async decrementOrederAfter(playlist_id: number, order: number, transaction?: Transaction): Promise<void> {
        await Playlist_Tracks.increment(
            { order: -1 },
            { 
                where: {
                    playlist_id,
                    order: {
                        [Op.gt]: order
                    }
                }, ...(transaction ? { transaction } : undefined)
            }
        )
    }
}