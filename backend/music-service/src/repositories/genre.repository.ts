import { Transaction } from "sequelize";
import { ApiError } from "shared/common/utils/ApiError/api-error";
import Genre from "src/config/db/modeles/Gener.model";
import TrackMetaGenres from "src/config/db/modeles/TrackMetaGenres.model";

export class GenreRepository {
    constructor(

    ) {}

    async findGenre(name: string): Promise<Genre | null> {
        const genre = await Genre.findOne({
            where: {
                name
            }
        })

        return genre
    }
  
    async findOrCreateGenre(name: string, transaction?: Transaction): Promise<Genre> { 
        const [genre] = await Genre.findOrCreate({
            where: { name },
            defaults: { name },
            transaction
        })

        return genre
    }

    async attachGenreToTrackMeta(genre_id: number, track_meta_id: number, transaction?: Transaction) {
        await TrackMetaGenres.create({
            track_meta_id,
            genre_id,
        }, transaction ? { transaction } : {})
    }
}