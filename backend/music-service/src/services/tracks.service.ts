import { Sequelize, Transaction } from "sequelize";
import { ApiError } from "shared/common/utils/ApiError/api-error";
import { rethrowAsApiError } from "shared/common/utils/ApiError/rethrowApiError";
import Track, { TrackAttributes } from "src/config/db/modeles/Track.model";
import Track_Likes from "src/config/db/modeles/Track_likes.model";
import TrackMeta from "src/config/db/modeles/TrackMeta.model";
import { TrackRepository } from "src/repositories/track.repository";
import { FetchUserLikedTracks } from "src/responses/tracks/fetchUserLikedTracks.response";
import { FetchTrackResponse, fetchTrackSchema } from "src/schemas/fetchTrack.schema";
import { fetchUserLikedTracksSchema, FetchUserLikedTracksResonse } from "src/schemas/fetchUserLikedTracks.schema";
import { TrackAssertions } from "src/assertions/track.assertions";

export class TrackService {
    constructor(
        private sequelize: Sequelize,
        private trackRepository: TrackRepository,
        private trackAssertions: TrackAssertions,
    ) {}

    async createTrack(params: Partial<TrackAttributes>, transaction: Transaction) { 
        try {
            const track = await this.trackRepository.createTrack(params, transaction)

            return track
        } catch (e) {
            throw rethrowAsApiError('Error while creating track', 'TRACK_CREATE_ERROR', e)
        }
    }

    async updateTrackData(track_id: number, params: Partial<TrackAttributes>, transaction?: Transaction) {
        try {
            const track = await this.trackAssertions.ensureTrackExists(track_id)
            await this.trackRepository.updateTrackData(track, params, transaction)
        } catch (e) {
            throw rethrowAsApiError('Error while updating track', 'TRACK_UPDATE_ERROR', e)
        }
    }

    // Нужна будет проверка на фронте в случае если трек не публичный
    async fetchUserLikedTracks(user_id: number, limit: number, offset: number): Promise<FetchUserLikedTracksResonse[]> {
        const likedTracksRaw = await this.trackRepository.fetchUserLikedTracks(user_id, limit, offset)

        const likedTracks = likedTracksRaw.map(track => fetchUserLikedTracksSchema.parse(track))

        return likedTracks
    }

    async fetchTrack(id: number): Promise<FetchTrackResponse> {
        const trackRaw = await this.fetchTrack(id)

        if (!trackRaw) {
            throw ApiError.NotFound('There is no track with this ID', 'TRACK_NOT_FOUND')
        }

        const track = fetchTrackSchema.parse(trackRaw)

        return track
    }
}