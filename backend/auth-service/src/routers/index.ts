import { Router } from 'express'
import authRoute from './auth.routes'
import healthRoute from './health.routes'

const router = Router()

router.use(authRoute)
router.use(healthRoute)

export default router