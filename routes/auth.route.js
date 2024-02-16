import express from 'express';
import { authWithGoogle } from '../controllers/auth.controllers.js';

const router = express.Router();

router.post('/google', authWithGoogle);

export default router;
