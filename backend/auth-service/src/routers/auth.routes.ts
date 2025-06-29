import { Router } from 'express'
import { Register, Login, Logout, AuthMe } from '../controllers/auth.controller'

const router = Router()

router.post('/register', Register)
router.post('/login', Login)
router.get('/me', AuthMe)
router.delete('/logout', Logout)


export default router