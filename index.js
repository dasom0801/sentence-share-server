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

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/sentence', sentenceRoutes);
app.use('/api/book', bookRoutes);

app.use(invalidPathHandler);
app.use(errorResponseHandler);

app.listen('8080', () => {
  console.log('Server is listening');
});
