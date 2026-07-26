import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { shareWillHandler, getAdvocatesHandler } from '../controllers/advocateController.js'

const router = Router()
router.use(authenticate)

router.post('/share', shareWillHandler)   // POST /api/advocate/share — send will + save advocate
router.get('/', getAdvocatesHandler)      // GET  /api/advocate      — list saved advocates

export default router
