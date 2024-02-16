export const getUser = (req, res, next) => {
  const { user } = req;
  try {
    if (user) {
      const { uid, ...userInfo } = user._doc;
      return res.status(200).json({
        ...userInfo,
      });
    } else {
      const err = new Error();
      err.message = 'Not authorized';
      err.statusCode = 401;
      throw err;
    }
  } catch (error) {
    next(error);
  }
};
