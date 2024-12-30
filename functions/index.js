/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from 'firebase-functions/v2';
import { onRequest } from 'firebase-functions/v2/https';
import logger from 'firebase-functions/logger';
import app from './server.js';

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started
setGlobalOptions({ region: 'asia-east1' });
const api = onRequest(app);

export { api };
