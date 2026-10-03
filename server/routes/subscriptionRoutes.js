import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { createOrderHandler, verifyPaymentHandler, getPlanHandler, manualUpgradeHandler } from '../controllers/subscriptionController.js'

const router = Router()
router.use(authenticate)

router.get('/',                getPlanHandler)
router.post('/create-order',   createOrderHandler)
router.post('/verify-payment', verifyPaymentHandler)
router.post('/manual-upgrade', manualUpgradeHandler)

export default router
