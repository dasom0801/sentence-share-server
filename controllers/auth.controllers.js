import User from '../models/user.model.js';
import { generateUserToken } from '../utils/utils.js';

export const authWithGoogle = async (req, res, next) => {
  const { uid, name, provider, profileUrl, email } = req.body;

  try {
    const findUser = await User.findOne({ uid });
    if (findUser) {
      const token = generateUserToken(findUser);
      return res.status(200).json({
        message: '성공적으로 로그인했습니다.',
        code: 'LOGIN_SUCCESS',
        user: {
          ...findUser._doc,
        },
        token,
      });
    } else {
      const user = await User.create({
        uid,
        name,
        provider,
        profileUrl,
        email,
      });
      const token = generateUserToken(user);
      return res.status(200).json({
        message: '성공적으로 회원가입했습니다.',
        code: 'REGISTER_SUCCESS',
        user,
        token,
      });
    }
  } catch (error) {
    next(error);
  }
};
