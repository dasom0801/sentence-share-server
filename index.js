import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/db.js';
import {
  invalidPathHandler,
  errorResponseHandler,
} from './middleware/errorHandler.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(invalidPathHandler);
app.use(errorResponseHandler);

connectDB().then(() => {
  app.listen('8080', () => {
    console.log('Server is listening');
  });
});
