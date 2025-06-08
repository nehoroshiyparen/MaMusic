import { Sequelize, Transaction } from "sequelize";
import { ApiError } from "shared/common/utils/ApiError/api-error";
import { rethrowAsApiError } from "shared/common/utils/ApiError/rethrowApiError";
import Track, { TrackAttributes } from "src/config/db/modeles/Track.model";
import Track_Likes from "src/config/db/modeles/Track_Likes.model";
import TrackMeta from "src/config/db/modeles/TrackMeta.model";
import { TrackRepository } from "src/repositories/track.repository";
import { FetchUserLikedTracks } from "src/responses/tracks/fetchUserLikedTracks.response";
import { FetchTrackResponse, fetchTrackSchema } from "src/schemas/fetchTrack.schema";
import { fetchUserLikedTracksSchema, FetchUserLikedTracksResonse } from "src/schemas/fetchUserLikedTracks.schema";
import { TrackAssertions } from "src/assertions/track.assertions";
import { createFilename } from "src/utils/urlBuilders/urlFactory";
import { S3Service } from "./S3.service";

export class TrackService {
    constructor(
        private sequelize: Sequelize,
        private trackRepository: TrackRepository,
        private trackAssertions: TrackAssertions,
        private s3Service: S3Service
    ) {}

    async createTrack(params: Partial<TrackAttributes>, transaction: Transaction) { 
        try {
            const track = await this.trackRepository.createTrack(params, transaction)

            return track
        } catch (e) {
            throw rethrowAsApiError('Error while creating track', 'TRACK_CREATE_ERROR', e)
        }
    }

    async updateTrackData(trackIdentifier: number | Track, params: Partial<TrackAttributes>, transaction?: Transaction): Promise<void> {
        try {

            const track = trackIdentifier instanceof Track
                ? trackIdentifier
                : await this.trackAssertions.ensureTrackExists(trackIdentifier) 
            await this.trackRepository.updateTrackData(track, params, transaction)
        } catch (e) {
            throw rethrowAsApiError('Error while updating track', 'TRACK_UPDATE_ERROR', e)
        }
    }

    // Нужна будет проверка на фронте в случае если трек не публичный
    async fetchUserLikedTracks(user_id: number, limit: number = 15, offset: number = 0): Promise<FetchUserLikedTracksResonse[]> {
        try {
            const likedTracksRaw = await this.trackRepository.fetchUserLikedTracks(user_id, limit, offset)

            const likedTracks = likedTracksRaw.map(track => fetchUserLikedTracksSchema.parse(track))

            return likedTracks
        } catch (e) {
            rethrowAsApiError('Error while fetching user liked tracks', 'LIKED_TRACKS_FETCH_ERROR', e)
        }
    }

    async fetchTrack(id: number): Promise<FetchTrackResponse> {
        try {
            await this.trackAssertions.ensureTrackExists(id)

            const trackRaw = await this.trackRepository.fetchTrack(id)

            const track = fetchTrackSchema.parse(trackRaw)

            return track
        } catch (e) {
            rethrowAsApiError('Error while fetching the track', 'TRACK_FETCH_ERROR', e)
        }
    }

    async likeTrack(user_id: number, track_id: number, transaction?: Transaction): Promise<void> {
        try {
            this.trackAssertions.ensureTrackExists(track_id)

            await this.trackRepository.likeTrack(user_id, track_id, transaction)
        } catch (e) {
            rethrowAsApiError('Error while liking track', 'TRACK_LIKE_ERROR', e)
        }
    }

    async trustedLikeTrack(user_id: number, track_id: number, transaction?: Transaction): Promise<void> {
        try {
            await this.trackRepository.likeTrack(user_id, track_id, transaction)
        } catch (e) {
            rethrowAsApiError('Error while liking track', 'TRACK_LIKE_ERROR', e)
        }
    }

    async deleteTrack(track_id: number): Promise<void> {
        const transaction = await this.sequelize.transaction()
        try {
            const trackRaw = await this.trackRepository.fetchTrack(track_id)
            const track = fetchTrackSchema.parse(trackRaw)

            const filename = createFilename(track.meta.title, track.meta.artists)
            const key = this.s3Service.generateS3Key('tracks', track_id, filename)

            await this.trackRepository.deleteTrack(track_id, transaction)

            await this.s3Service.deleteFromS3(key)

            await transaction.commit()
        } catch (e) {
            await transaction.rollback()
            rethrowAsApiError('Error while deleting the track', 'TRACK_DELETE_ERROR', e)
        }
    }
}