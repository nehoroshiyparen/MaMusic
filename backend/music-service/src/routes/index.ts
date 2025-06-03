import { Router } from "express";
import healthRoute from './health.routes'
import uploadRouter from './upload.routes'
import playlistRouter from './playlist.routes'
import trackController from './track.routes'

const router = Router()

router.use('/health', healthRoute)
router.use('/upload', uploadRouter)
router.use('/playlists', playlistRouter)
router.use('/tracks', trackController)

export default router