/**
 * Import function triggers from their respective submodules:
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import functions from 'firebase-functions';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/db.js';
import {
  invalidPathHandler,
  errorResponseHandler,
} from './middleware/error.middleware.js';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import sentenceRoutes from './routes/sentence.route.js';
import bookRoutes from './routes/book.route.js';

dotenv.config();

const app = express();
// DB연결
connectDB();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/sentence', sentenceRoutes);
app.use('/book', bookRoutes);

app.use(invalidPathHandler);
app.use(errorResponseHandler);

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started
// /api prefix를 가지는 요청을 express 라우터로 전달
const api = functions.region('asia-northeast2').https.onRequest(app);

export { api };
