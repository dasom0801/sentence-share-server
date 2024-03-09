import express from 'express';
import { authGuard } from '../middleware/auth.middleware.js';
import {
  deleteSentence,
  getSentences,
  createSentence,
  toggleSentenceLike,
  updateSentence,
} from '../controllers/sentence.controller.js';
import { valiateSentence } from '../utils/validators.js';

const router = express.Router();

router.get('/', getSentences);
router.post('/', authGuard, valiateSentence, createSentence);
router.put('/:id', authGuard, valiateSentence, updateSentence);
router.delete('/:id', authGuard, deleteSentence);
router.put('/:id/like', authGuard, toggleSentenceLike);

export default router;
