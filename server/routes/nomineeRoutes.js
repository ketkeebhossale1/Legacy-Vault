import { Router } from 'express'
import { listNominees, createNominee, updateNominee } from '../controllers/nomineeController.js'

const router = Router()

router.get('/', listNominees)
router.post('/', createNominee)
router.patch('/:id', updateNominee)

export default router
