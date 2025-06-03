import { Router } from "express";
import { createHandler } from "shared/common/helpers/create.handler";
import { getContainer } from "src/di/container";

const router = Router()

function getController() {
    const container = getContainer()
    const trackController = container.getTrackController()
    return trackController
}

router.get(
    '/liked/:id',
    createHandler(() => {
        const trackController = getController()
        return trackController.fetchUserLikedTracks.bind(trackController)
    })
)

router.get(
    '/:id',
    createHandler(() => {
        const trackController = getController()
        return trackController.fetchTrack.bind(trackController)
    })
)

export default router