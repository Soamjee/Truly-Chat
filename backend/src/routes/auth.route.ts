import { Router } from 'express'
import { CheckUser, Login, Logout, SignUp, UpdateProfile } from '../controllers/auth.controller.js'
import { authenticatedRoute } from '../middleware/auth.middleware.js'

const router = Router()

router.post('/signup', SignUp)

router.post('/login', Login)

router.post('/logout', Logout)

router.put('/update-profile', authenticatedRoute ,UpdateProfile)

// whenerver user refreshes the page, it will determine wheather user is authenticated or not.

router.get('/check', authenticatedRoute, CheckUser)

export default router