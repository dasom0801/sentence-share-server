import admin from 'firebase-admin';
import dotenv from 'dotenv';
import serviceAccount from './service-account-file.json' assert { type: 'json' };

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://sentence-share.firebaseio.com',
});

export default admin;
