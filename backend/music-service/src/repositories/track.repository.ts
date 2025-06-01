import { Transaction } from "sequelize";
import Track, { TrackAttributes } from "src/config/db/modeles/Track.model";
import Track_Likes from "src/config/db/modeles/Track_likes.model";
import TrackMeta, { TrackMetaAttributes } from "src/config/db/modeles/TrackMeta.model";
import { parseArgs } from "util";

export class TrackRepository {
    constructor(

    ) {}

    async createTrack(params: Partial<TrackAttributes>, transaction?: Transaction): Promise<Track> {
        const track = await Track.create({
            file_url: params.file_url || '',
            owner_id: params.owner_id
        }, transaction ? { transaction } : undefined)

        return track
    }

    async updateTrackData(track: Track, params: Omit<Partial<TrackAttributes>, 'track_id'>, transaction?: Transaction): Promise<void> {
        const cleanedParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== null && value !== undefined)
        )

        await track.update({
            cleanedParams
        }, transaction ? { transaction } : undefined)
    }

    async fetchTrack(id: number) {
        const track = await Track.findOne({
            attributes: { exclude: ['file_url'] },
            where: { 
                id
            },
            include: [
                {
                    model: TrackMeta,
                    as: 'meta'
                }
            ]
        })

        return track
    }

    async fetchUserLikedTracks(user_id: number, limit: number, offset: number) {
        const likedTracks = await Track.findAll({
            attributes: { exclude: ['file_url'] },
            limit,
            offset,
            include: [
                {
                    model: Track_Likes,
                    as: 'likes',
                    where: { user_id },
                    attributes: [],
                    required: true
                },
                {
                    model: TrackMeta,
                    as: 'meta',
                    attributes: { 
                        exclude: ['id', 'track_id']
                    }
                }
            ],
            raw: true,
            nest: true,
        })

        return likedTracks
    }
}