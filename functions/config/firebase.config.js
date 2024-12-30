import admin from 'firebase-admin';
import dotenv from 'dotenv';

import path from 'path';
import serviceAccount from path.resolve(__dirname, './config/service-account-key.json') assert { type: 'json' };

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://sentence-share.firebaseio.com',
});

export default admin;
