import { Router } from "express";
import healthRoute from './health.routes'
import uploadRouter from './upload.routes'

const router = Router()

router.use(healthRoute)
router.use(uploadRouter)

export default router