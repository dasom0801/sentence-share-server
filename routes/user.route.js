import express from 'express';
import { getUser, updateUser } from '../controllers/user.controllers.js';
import { authGuard } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/me', authGuard, getUser);
router.put('/me', authGuard, updateUser);

export default router;
