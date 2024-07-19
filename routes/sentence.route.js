import express from 'express';
import { authGuard } from '../middleware/auth.middleware.js';
import {
	deleteSentence,
	getSentences,
	getSentence,
	createSentence,
	toggleSentenceLike,
	updateSentence,
	searchBook,
} from '../controllers/sentence.controller.js';
import { validateSentence } from '../utils/validators.js';

const router = express.Router();

router.get('/', getSentences);
router.get('/:id', getSentence);
router.get('/search/book', searchBook);
router.post('/', authGuard, validateSentence, createSentence);
router.put('/:id', authGuard, validateSentence, updateSentence);
router.delete('/:id', authGuard, deleteSentence);
router.put('/:id/like', authGuard, toggleSentenceLike);

export default router;
