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
    '/liked',
    createHandler(() => {
        const trackController = getController()
        return trackController.fetchUserLikedTracks.bind(trackController)
    })
)

router.get(
    '/:track_id',
    createHandler(() => {
        const trackController = getController()
        return trackController.fetchTrack.bind(trackController)
    })
)

router.post(
    '/like/:track_id',
    createHandler(() => {
        const trackController = getController()
        return trackController.likeTrack.bind(trackController)
    })
)

router.post(
    '/dislike/:track_id',
    createHandler(() => {
        const trackController = getController()
        return trackController.dislikeTrack.bind(trackController)
    })
)

router.delete(
    '/:track_id',
    createHandler(() => {
        const trackController = getController()
        return trackController.deleteTrack.bind(trackController)
    })
)

export default router