import express from 'express';
import {
  getUser,
  getUserSentence,
  updateUser,
  getUserLike,
} from '../controllers/user.controllers.js';
import { authGuard } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/me', authGuard, getUser);
router.put('/me', authGuard, updateUser);
router.get('/:userId/sentence', getUserSentence);
router.get('/:userId/like', getUserLike);

export default router;
