import dotenv from 'dotenv'
import { Sequelize, where } from "sequelize"
import { getMetadataFromBuffer } from "src/utils/parsers/Metadata.parser"
import Track from "src/config/db/modeles/Track.model"
import { rethrowAsApiError } from 'shared/common/utils/ApiError/rethrowApiError'
import TrackMeta from "src/config/db/modeles/TrackMeta.model"
import { CreateTrackDto } from "src/dto/createTrack.dto"
import { MulterFile } from "src/types/MulterFile.interface"
import { S3Service } from './S3.service'
import Genre from 'src/config/db/modeles/Gener.model'
import TrackMetaGenres from 'src/config/db/modeles/TrackMetaGenres.model'
import { logError } from 'shared/common/utils/logger/logger'
import { UploadTrackResponse } from 'src/responses/upload/uploadTrack.response'
import { TrackRepository } from 'src/repositories/track.repository'
import { GenreRepository } from 'src/repositories/genre.repository'
import { TrackService } from './tracks.service'
import { TrackMetaService } from './trackMeta.service'
import { GenreService } from './genre.service'

dotenv.config()

export class UploadService {
    constructor(
        private sequelize: Sequelize,
        private s3Service: S3Service,
        private trackService: TrackService,
        private trackMetaService: TrackMetaService,
        private genreService: GenreService,
    ) {
    }

    async uploadTrack(track: MulterFile, user_id: number, trackSettings: CreateTrackDto, cover?: MulterFile): Promise<UploadTrackResponse> {
        const transaction = await this.sequelize.transaction()
        const uploadedKeys = []
        try {
            const { buffer, originalname, mimetype } = track
            const meta = await getMetadataFromBuffer(buffer)

            const trackModel = await this.trackService.createTrack({ owner_id: user_id }, transaction)

            const trackKey = this.s3Service.generateS3Key('tracks', trackModel.id, originalname)
            await this.s3Service.sendObjectS3(trackKey, buffer, mimetype)
            uploadedKeys.push(trackKey)

            await this.trackService.updateTrackData(trackModel.id, { file_url: trackKey }, transaction)

            let coverKey: string | undefined
            if (cover) {
                coverKey = this.s3Service.generateS3Key('covers', trackModel.id, cover.filename)
                await this.s3Service.sendObjectS3(coverKey, cover.buffer, cover.mimetype || 'default')
                uploadedKeys.push(coverKey)
            }

            const trackMetaModel = await this.trackMetaService.createTrackMeta(
                trackModel.id,
                {
                    title: trackSettings.title,
                    artists: trackSettings.artists,
                    duration: meta.format.duration,
                    cover_url: coverKey,
                },
                transaction
            )

            const genres = meta.common.genre
            if (genres && genres.length > 0) {
                await Promise.all(
                    genres.map(async (genre) => {
                        const genreModel = await this.genreService.findOrCreateGenre(genre, transaction)
                        await this.genreService.attachGenreToTrackMeta(genreModel.id, trackMetaModel.id)
                    })
                )
            }

            await transaction.commit()
            return { trackUrl: trackKey, ...(coverKey && { coverUrl: coverKey }) }
        } catch (e) {
            await transaction.rollback()

            await Promise.all(uploadedKeys.map(async (key) => {
                try {
                    this.s3Service.deleteFromS3(key)
                } catch (e) {
                    logError(`Failed to delete ${key} from S3`, e)
                }
            }))

            logError('Track upload error:', e)
            throw rethrowAsApiError('Track upload error', 'TRACK_UPLOAD_ERROR', e)
        }
    }
}