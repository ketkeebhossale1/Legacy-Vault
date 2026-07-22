import { Router } from 'express'
import { list } from '../controllers/auditController.js'
const router = Router()
router.get('/', list)
export default router
