import { Router } from 'express'
import healthRoute from './health.routes'

const router = Router()

router.use("/health", healthRoute)

export default router