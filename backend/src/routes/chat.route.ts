import express from 'express'
import { GetAllChats, GetAllUsers, SendMessage } from '../controllers/chat.controller'
import { authenticatedRoute } from '../middleware/auth.middleware'

const router = express()

router.get('/users', authenticatedRoute, GetAllUsers)
router.get('/:id', authenticatedRoute, GetAllChats)
router.post('/send/:id', authenticatedRoute, SendMessage)

export default router