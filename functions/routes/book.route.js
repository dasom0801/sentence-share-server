import express from 'express';
import { getBook, getBookSentences } from '../controllers/book.controller.js';

const router = express.Router();

router.get('/:id', getBook);
router.get('/:id/sentences', getBookSentences);

export default router;
