import { Transaction } from "sequelize";
import { rethrowAsApiError } from "shared/common/utils/ApiError/rethrowApiError";
import { GenreRepository } from "src/repositories/genre.repository";
import { GenreAssertions } from "src/assertions/genre.assertions";

export class GenreService {
    constructor(
        private genreRepository: GenreRepository,
        private genreAssertions: GenreAssertions,
    ) {}

    async findOrCreateGenre(name: string, transaction?: Transaction) {
        try {
            await this.genreAssertions.ensureGenreDoesNotExists(name)
            const genre = await this.genreRepository.findOrCreateGenre(name, transaction)

            return genre
        } catch (e) {
            throw rethrowAsApiError('Error while searching/creating genre', 'GENRE_FIND_OR_CREATE_ERROR', e)
        }
    }
    
    async attachGenreToTrackMeta(genre_id: number, track_meta_id: number, transaction?: Transaction) {
        try {
            await this.genreAssertions.ensureGenreNotAttached(genre_id, track_meta_id)
            await this.genreRepository.attachGenreToTrackMeta(genre_id, track_meta_id, transaction)
        } catch (e) {
            throw rethrowAsApiError('Error while attaching genre to meta', 'GENRE_TO_META_ATTACH_ERROR', e)
        }
    }
}