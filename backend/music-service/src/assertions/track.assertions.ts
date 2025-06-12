import { Sequelize } from "sequelize";
import { ApiError } from "shared/common/utils/ApiError/api-error";
import Track from "src/config/db/modeles/Track.model";
import Track_Likes from "src/config/db/modeles/Track_Likes.model";

export class TrackAssertions {
    constructor(
        private sequelize: Sequelize,
    ) {}

    async ensureTrackExists(track_id: number): Promise<Track> {
        const track = await Track.findOne({
            where: { id: track_id },
        })

        if (!track) throw ApiError.NotFound('Track does not exists', 'TRACK_DOES_NOT_EXISTS')

        return track
    }

    async ensureTrackDoNotLiked(user_id: number, track_id: number) {
        const attachment = await Track_Likes.findOne({
            where: {
                user_id,
                track_id
            }
        })

        if (attachment) {
            throw ApiError.Conflict('Track already liked', 'TRACK_ALREADY_LIKED')
        }
    }

    async ensureTrackLiked(user_id: number, track_id: number) {
        const attachment = await Track_Likes.findOne({
            where: {
                user_id,
                track_id
            }
        })

        if (!attachment) {
            throw ApiError.NotFound('Track do not liked', 'TRACK_DO_NOT_LIKED')
        }
    }
}