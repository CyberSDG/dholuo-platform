import { Router } from 'express'
import {
  searchWords,
  getWord,
  getCategories,
  getRandomWords,
  submitContribution,
} from '../controllers/wordsController'

const router = Router()

router.get('/search', searchWords)
router.get('/categories', getCategories)
router.get('/random', getRandomWords)
router.get('/:id', getWord)
router.post('/contribute', submitContribution)

export default router
