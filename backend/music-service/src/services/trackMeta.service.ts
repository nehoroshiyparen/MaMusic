import { Transaction } from "sequelize";
import { rethrowAsApiError } from "shared/common/utils/ApiError/rethrowApiError";
import TrackMeta, { TrackMetaAttributes } from "src/config/db/modeles/TrackMeta.model";

export class TrackMetaService {
    constructor(

    ) {}

    async createTrackMeta(track_id: number, params: Omit<Partial<TrackMetaAttributes>, 'track_id'>, transaction?: Transaction) {
        try {
            const clearedParams = Object.fromEntries(
                Object.entries(params).filter(([_, value]) => value !== null && value !== undefined)
            )

            const trackMeta = await TrackMeta.create(
                {track_id, clearedParams},
                transaction ? { transaction } : undefined)

            return trackMeta
        } catch (e) {
            throw rethrowAsApiError('Error while creating track meta', 'TRACK_META_CREATE_ERROR', e)
        }
    }
}