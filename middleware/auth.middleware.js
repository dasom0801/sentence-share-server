import admin from '../config/firebase.config.js';
import User from '../models/user.model.js';

export const authGuard = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      const user = await User.findOne({ uid: decodedToken.uid });
      req.user = user;
      next();
    } catch (error) {
      const err = new Error('Not authorized');
      err.statusCode = 401;
      next(err);
    }
  } else {
    const error = new Error('Not authorized');
    error.statusCode = 401;
    next(error);
  }
};
