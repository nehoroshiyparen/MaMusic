import { Router } from "express";
import { createHandler } from "shared/common/helpers/create.handler";
import { getContainer } from "src/di/container";

const router = Router()

function getController() {
    const container = getContainer()
    const playlistController = container.getPlaylistController()
    return playlistController
}

router.post(
    '/create',
    createHandler(() => {
        const playlistController = getController()
        return playlistController.createPlaylist.bind(playlistController)
    })
)

router.post(
    '/add/:id',
    createHandler(() => {
        const playlistController = getController()
        return playlistController.addTrackToPlaylist.bind(playlistController)
    })
)

router.post(
    'delete/:id',
    createHandler(() => {
        const playlistController = getController()
        return playlistController.deleteTrackFromPlaylist.bind(playlistController)
    })
)

export default router