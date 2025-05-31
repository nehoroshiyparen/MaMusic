import { ApiError } from "shared/common/utils/ApiError/api-error";
import Track from "src/config/db/modeles/Track.model";
import Track_Likes from "src/config/db/modeles/Track_likes.model";
import TrackMeta from "src/config/db/modeles/TrackMeta.model";
import { FetchUserLikedTracks } from "src/responses/tracks/fetchUserLikedTracks.response";
import { FetchTrackResponse, fetchTrackSchema } from "src/schemas/fetchTrack.schema";
import { fetchUserLikedTracksSchema, FetchUserLikedTracksResonse } from "src/schemas/fetchUserLikedTracks.schema";

export class TrackService {
    constructor(

    ) {}

    // Нужна будет проверка на фронте в случае если трек не публичный
    async fetchUserLikedTracks(user_id: number, limit: number, offset: number): Promise<FetchUserLikedTracksResonse[]> {
        const likedTracksRaw = await Track.findAll({
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

        const likedTracks = likedTracksRaw.map(track => fetchUserLikedTracksSchema.parse(track))

        return likedTracks
    }

    async fetchTrack(id: number): Promise<FetchTrackResponse> {
        const trackRaw = await Track.findOne({
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

        if (!trackRaw) {
            throw ApiError.NotFound('There is no track with this ID', 'TRACK_NOT_FOUND')
        }

        const track = fetchTrackSchema.parse(trackRaw)

        return track
    }
}