import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
import { requireAdmin } from '../middleware/requireAdmin'
import { listContributions, approveContribution, rejectContribution, getStats } from '../controllers/adminController'

const router = Router()

router.use(requireAuth, requireAdmin)

router.get('/stats', getStats)
router.get('/contributions', listContributions)
router.post('/contributions/:id/approve', approveContribution)
router.post('/contributions/:id/reject', rejectContribution)

export default router
