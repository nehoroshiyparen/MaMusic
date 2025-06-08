import { Router } from 'express'
import { getContainer } from 'src/di/container'
import { createHandler } from 'shared/common/helpers/create.handler'
import multer from 'multer'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post(
    '/',
    upload.fields([
        { name: 'track', maxCount: 1 },
        { name: 'cover', maxCount: 1 },
    ]),
    createHandler(() => {
        const container = getContainer()
        const uploadController = container.getUploadController()
        return uploadController.uploadTrack.bind(uploadController)
    })
)

export default router