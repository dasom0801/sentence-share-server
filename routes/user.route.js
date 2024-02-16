import express from 'express';
import { getUser } from '../controllers/user.controllers.js';
import { authGuard } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/me', authGuard, getUser);

export default router;
