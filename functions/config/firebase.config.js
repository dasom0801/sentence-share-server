import admin from 'firebase-admin';
import dotenv from 'dotenv';

import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const serviceAccountPath = path.resolve(
  __dirname,
  './service-account-file.json',
);
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://sentence-share.firebaseio.com',
});

export default admin;
