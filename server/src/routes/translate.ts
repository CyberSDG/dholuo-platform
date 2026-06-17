import { Router } from 'express'
import { translate } from '../controllers/translateController'

const router = Router()

router.post('/', translate)

export default router
