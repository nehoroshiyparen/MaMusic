import { Router } from 'express'
import userRoute from './user.routes'
import healthRoute from './health.routes'

const router = Router()

router.use(userRoute)
router.use(healthRoute)

export default router