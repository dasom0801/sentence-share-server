import express from 'express';
import { authGuard } from '../middleware/auth.middleware.js';
import {
  deleteSentence,
  toggleSentenceLike,
} from '../controllers/sentence.controller.js';

const router = express.Router();

router.delete('/:id', authGuard, deleteSentence);
router.put('/:id/like', authGuard, toggleSentenceLike);

export default router;
