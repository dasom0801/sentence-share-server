import User from '../models/user.model.js';

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

export const updateUser = async (req, res, next) => {
  try {
    const { user } = req;
    const { name, profileUrl } = req.body;
    const filter = { _id: user._id };
    const update = { name, profileUrl };
    if (user) {
      const updatedUser = await User.findOneAndUpdate(filter, update, {
        new: true,
      });
      return res.status(200).json({ ...updatedUser._doc });
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
