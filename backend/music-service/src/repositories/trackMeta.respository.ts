import { Transaction } from "sequelize";
import TrackMeta, { TrackMetaAttributes } from "src/config/db/modeles/TrackMeta.model";

export class TrackMetaRepository {
    constructor(

    ) {}

    async createTrackMeta(track_id: number, params: Partial<TrackMetaAttributes>, transaction?: Transaction): Promise<TrackMeta> {
        console.log(params)

        const trackMeta = await TrackMeta.create(
            { 
                track_id,
                title: params.title,
                artists: params.artists,
                duration: params.duration
            },
            transaction ? { transaction } : undefined
        )

        return trackMeta
    }
}