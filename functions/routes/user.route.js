import express from 'express';
import {
  getUser,
  getUserSentence,
  updateUser,
  getUserLike,
  deleteUser,
} from '../controllers/user.controller.js';
import { authGuard } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/me', getUser);
router.put('/me', authGuard, updateUser);
router.delete('/withdrawal', authGuard, deleteUser);
router.get('/:userId/sentence', getUserSentence);
router.get('/:userId/like', getUserLike);

export default router;
