import express from 'express'
import { sendMessage ,gesMessages } from '../controllers/message.controller.js'
import protectRoute from '../middleware/protectRoute.middleware.js'


const router = express.Router()

router.post('/send/:id', protectRoute, sendMessage)
router.get('/:id', protectRoute, gesMessages)





export default router