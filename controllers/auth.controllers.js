import User from '../models/user.model.js';

export const authWithGoogle = async (req, res, next) => {
  const { uid, name, provider, profileUrl, email } = req.body;

  try {
    const findUser = await User.findOne({ uid });
    if (findUser) {
      return res.status(200).json({
        message: '성공적으로 로그인했습니다.',
        code: 'LOGIN_SUCCESS',
        user: {
          _id: findUser._id,
          name: findUser.name,
        },
      });
    } else {
      const user = await User.create({
        uid,
        name,
        provider,
        profileUrl,
        email,
      });

      return res.status(200).json({
        message: '성공적으로 회원가입했습니다.',
        code: 'REGISTER_SUCCESS',
        user: {
          _id: user._id,
          name: user.name,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};
