import { ApiError } from "shared/common/utils/ApiError/api-error";
import Genre from "src/config/db/modeles/Gener.model";
import TrackMetaGenres from "src/config/db/modeles/TrackMetaGenres.model";

export class GenreAssertions {
    constructor(

    ) {}

    async ensureGenreExists(name: string): Promise<Genre> {
        const genre = await Genre.findOne({
            where: {
                name
            }
        })

        if (!genre) throw ApiError.NotFound('Genre does not exists', 'GENRE_DOES_NOT_EXISTS')

        return genre
    }

    // Здесь не нужна проброска ошибки
    async ensureGenreDoesNotExists(name: string): Promise<Genre | null> {
        const genre = await Genre.findOne({
            where: {
                name
            }
        })

        return genre
    }

    async ensureGenreNotAttached(genre_id: number, track_meta_id: number): Promise<void> {
        const attachment = await TrackMetaGenres.findOne({
            where: {
                track_meta_id,
                genre_id,
            }
        })

        if (attachment) {
            throw ApiError.Conflict('Track meta already atteched to this genre', 'META_AND_GENRE_ALREADY_ATTACHED')
        }
    }
}