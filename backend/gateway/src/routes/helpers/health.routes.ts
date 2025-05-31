import { Router } from 'express'
import { generalHealthCheck, healthCheck } from '../../controllers/health.controller'

const router = Router()

router.get('/healthCheck', healthCheck)
router.get('/generalHealthCheck', generalHealthCheck)

export default router