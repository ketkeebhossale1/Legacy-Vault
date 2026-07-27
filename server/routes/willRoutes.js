import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { uploadCertificate } from '../middleware/uploadCertificate.js'
import { getWillHandler, saveWillHandler, generateWillHandler, uploadCertificateHandler } from '../controllers/willController.js'

const router = Router()
router.use(authenticate)

router.get('/',                    getWillHandler)
router.post('/',                   saveWillHandler)
router.post('/generate',           generateWillHandler)
router.post('/certificate',        uploadCertificate, uploadCertificateHandler)

export default router
