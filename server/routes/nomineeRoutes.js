import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { listNominees, createNominee, updateNominee } from '../controllers/nomineeController.js'

const router = Router()

router.use(authenticate)

router.get('/', listNominees)
router.post('/', createNominee)
router.patch('/:id', updateNominee)

export default router
