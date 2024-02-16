import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

const { privateKey } = JSON.parse(process.env.FIREBASE_PRIVATE_KEY);

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'sentence-share',
    private_key: privateKey,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
  }),
  databaseURL: 'https://sentence-share.firebaseio.com',
});

export default admin;
