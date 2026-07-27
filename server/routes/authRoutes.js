import { Router } from 'express'
import { signin, signup, forgotPassword, resetPassword } from '../controllers/authController.js'
const router = Router()
router.post('/signup', signup)
router.post('/signin', signin)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
export default router
