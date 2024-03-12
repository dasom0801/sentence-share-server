import express from 'express';
import { getBookSentences } from '../controllers/book.controllers.js';

const router = express.Router();

router.get('/:id/sentences', getBookSentences);

export default router;
