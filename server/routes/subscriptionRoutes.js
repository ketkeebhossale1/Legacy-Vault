import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { createOrderHandler, verifyPaymentHandler, getPlanHandler } from '../controllers/subscriptionController.js'

const router = Router()
router.use(authenticate)

router.get('/',                getPlanHandler)
router.post('/create-order',   createOrderHandler)
router.post('/verify-payment', verifyPaymentHandler)

export default router
