import { Router } from 'express'
import { createHandler } from 'shared/common/helpers/create.handler'
import { getContainer } from 'src/di/container'

const router = Router()

function getController() {
    const container = getContainer()
    const streamController = container.getStreamController()
    return streamController
}

router.get(
    '/:id',
    createHandler(() => {
        const streamController = getController()
        return streamController.getStream.bind(streamController)
    })
)

export default router