import express from 'express'
import authRoute from './auth.routes.js'
import messageRoute from './message.routes.js'
import userRoute from './user.routes.js'


const router = express.Router()

router.use('/api/auth', authRoute)
router.use('/api/messages', messageRoute)
router.use('/api/users', userRoute)


export default router