import express from 'express';
import { authGuard } from '../middleware/auth.middleware.js';
import { toggleSentenceLike } from '../controllers/sentence.controller.js';

const router = express.Router();

router.put('/:id/like', authGuard, toggleSentenceLike);

export default router;
