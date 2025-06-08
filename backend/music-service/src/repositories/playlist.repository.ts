import { Op, Transaction } from "sequelize";
import Playlist from "src/config/db/modeles/Playlist.model";
import Playlist_Likes from "src/config/db/modeles/Playlist_Likes.model";
import Playlist_Tracks from "src/config/db/modeles/Playlist_Tracks.model";
import Track from "src/config/db/modeles/Track.model";
import { UpdatePlaylistDto } from "src/dto/playlist/updatePlaylist.dto";

export class PlaylistRepository {
    constructor(

    ) {}

    async fetchPlaylist(playlist_id: number) {
        return await Playlist.findOne({
            where: {
                id: playlist_id
            },
            attributes: {
                exclude: [
                    'createdAt',
                    'updatedAt',
                    'id'
                ]
            },
            include: [
                {
                    model: Playlist_Tracks,
                    as: 'playlist_tracks',
                    include: [
                        {
                            model: Track,
                            as: 'track',
                            attributes: {
                                exclude: [
                                    'createdAt',
                                    'updatedAt',
                                ]
                            }
                        },
                    ],
                    attributes: [
                        'order'
                    ]
                }
            ],
        })
    }

    async fetchUserLikedPlaylists(user_id: number) {
        return await Playlist.findAll({
            include: [
                {
                    model: Playlist_Likes,
                    as: 'likes',
                    where: { user_id },
                    attributes: []
                }
            ],
            attributes: {
                exclude: [
                    'createdAt',
                    'updatedAt',
                    'id'
                ]
            }
        })
    }

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

    async updatePlaylist(playlist: Playlist, patch: UpdatePlaylistDto, transaction?: Transaction): Promise<void> {
        const cleanedParams = Object.fromEntries(
            Object.entries(patch).filter(([_, value]) => value !== null && value !== undefined)
        )

        await playlist.update(
            cleanedParams,
            transaction ? { transaction } : undefined
        )
    }

    async likePlaylist(user_id: number, playlist_id: number, transaction?: Transaction): Promise<void> {
        await Playlist_Likes.create({
            user_id,
            playlist_id
        }, transaction ? { transaction } : undefined)
    }

    async dislikePlaylist(user_id: number, playlist_id: number): Promise<void> {
        await Playlist_Likes.destroy({
            where: {
                user_id,
                playlist_id
            }
        })
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

    async deletePlaylist(playlist_id: number) {
        await Playlist.destroy({
            where: {
                id: playlist_id
            }
        })
    }

    /**
     * Возвращает максимальный order для треков в плейлисте.
     */
    async getMaxOrder(playlist_id: number, transaction?: Transaction): Promise<number> {
        const maxOrder = await Playlist_Tracks.findOne({
            where: { playlist_id },
            attributes: ['order'],
            order: [['order', 'DESC']]
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