import { Router } from "express";
import { createHandler } from "shared/common/helpers/create.handler";
import { getContainer } from "src/di/container";

const router = Router()

function getController() {
    const container = getContainer()
    const playlistController = container.getPlaylistController()
    return playlistController
}

router.get(
    '/liked',
    createHandler(() => {
        const playlistController = getController()
        return playlistController.fetchUserLikedPlaylists.bind(playlistController)
    })
)

router.get(
    '/:playlist_id',
    createHandler(() => {
        const playlistController = getController()
        return playlistController.fetchPlaylist.bind(playlistController)
    })
)

router.post(
    '/',
    createHandler(() => {
        const playlistController = getController()
        return playlistController.createPlaylist.bind(playlistController)
    })
)

router.patch(
    '/:playlist_id',
    createHandler(() => {
        const playlistController = getController()
        return playlistController.updatePlaylist.bind(playlistController)
    })
)

router.post(
    '/like/:playlist_id',
    createHandler(() => {
        const playlistController = getController()
        return playlistController.likePlaylist.bind(playlistController)
    })
)

router.post(
    '/dislike/:playlist_id',
    createHandler(() => {
        const playlistController = getController()
        return playlistController.dislikePlaylist.bind(playlistController)
    })
)

router.post(
    '/add/:id',
    createHandler(() => {
        const playlistController = getController()
        return playlistController.addTrackToPlaylist.bind(playlistController)
    })
)

router.delete(
    '/:playlist_id/track',
    createHandler(() => {
        const playlistController = getController()
        return playlistController.deleteTrackFromPlaylist.bind(playlistController)
    })
)

router.delete(
    '/:playlist_id',
    createHandler(() => {
        const playlistController = getController()
        return playlistController.deletePlaylist.bind(playlistController)
    })
)

export default router