import { Router } from 'express'
import { Register, Login, Logout } from '../controllers/auth.controller'

const router = Router()

router.post('/register', Register)
router.post('/login', Login)
router.delete('/logout', Logout)

export default router