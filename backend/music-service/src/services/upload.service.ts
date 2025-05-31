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

dotenv.config()

export class MusicService {
    constructor(
        private sequelize: Sequelize,
        private s3Service: S3Service
    ) {
    }

    async uploadTrack(track: MulterFile, sender_id: number, trackSettings: CreateTrackDto, cover?: MulterFile): Promise<UploadTrackResponse> {
        const transaction = await this.sequelize.transaction()
        const uploadedKeys = []
        try {
            const { buffer, originalname, mimetype } = track
            const meta = await getMetadataFromBuffer(buffer)

            const trackModel = await Track.create({
                file_url: '',
                owner_id: sender_id,
            })

            const trackKey = this.s3Service.generateS3Key('tracks', trackModel.id, originalname)
            await this.s3Service.sendObjectS3(trackKey, buffer, mimetype)
            uploadedKeys.push(trackKey)

            await trackModel.update({ file_url: trackKey }, { transaction })

            let coverKey: string | undefined
            if (cover) {
                coverKey = this.s3Service.generateS3Key('covers', trackModel.id, cover.filename)
                await this.s3Service.sendObjectS3(coverKey, cover.buffer, cover.mimetype || 'default')
                uploadedKeys.push(coverKey)
            }

            const metaPayload = {
                track_id: trackModel.id,
                title: trackSettings.title,
                artists: trackSettings.artists,
                duration: meta.format.duration,
                ...(coverKey && { cover_url: coverKey }),
            }

            const trackMetaModel = await TrackMeta.create(metaPayload, { transaction })

            const genreName = meta.common.genre
            if (genreName) {
                const existing_genre = await Genre.findOne({
                    where: {name: genreName}
                })

                if (!existing_genre) {
                    const genre = await Genre.create({
                        name: genreName
                    }, {transaction})

                    TrackMetaGenres.create({
                        track_meta_id: trackMetaModel.id,
                        genre: genre.id
                    }, {transaction})
                }
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