import { getUserFromToken } from '../utils/utils.js';

export const authGuard = async (req, res, next) => {
  const trhowError = () => {
    const err = new Error('Not authorized');
    err.statusCode = 401;
    next(err);
  };
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const user = await getUserFromToken(req);
      if (!user) {
        trhowError();
      }
      req.user = user;
      next();
    } catch (error) {
      trhowError();
    }
  } else {
    trhowError();
  }
};
