import { Router } from "express";
import healthRoute from './health.routes'
import uploadRouter from './upload.routes'
import playlistRouter from './playlist.routes'
import trackRouter from './track.routes'
import streamRouter from './stream.routes'

const router = Router()

router.use('/health', healthRoute)
router.use('/upload', uploadRouter)
router.use('/playlists', playlistRouter)
router.use('/tracks', trackRouter)
router.use('/stream', streamRouter)

export default router