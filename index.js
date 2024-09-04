import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import compression from 'compression';

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

const corsOptions = {
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  origin: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://sentence-share.site',
  allowedHeaders: ['Content-Type', 'Authorization',],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(compression());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/sentence', sentenceRoutes);
app.use('/api/book', bookRoutes);
app.get('/health', (req, res, next) => {
  return res.status(200).json('ok');
});

app.use(errorResponseHandler);
app.use(invalidPathHandler);

app.listen('8080', () => {
  console.log('Server is listening');
});
