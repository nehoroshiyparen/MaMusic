import { Sequelize } from "sequelize";
import { ApiError } from "shared/common/utils/ApiError/api-error";
import Track from "src/config/db/modeles/Track.model";

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
}