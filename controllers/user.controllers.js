import admin from '../config/firebase.config.js';
import Like from '../models/like.model.js';
import Sentence from '../models/sentence.model.js';
import User from '../models/user.model.js';
import { calculateSkip, findSentenceDetails, getUserFromToken } from '../utils/utils.js';
import { userErrors } from '../utils/errors.js';

export const getUser = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    const user = await getUserFromToken(req);
    if (user) {
      const { uid, ...userInfo } = user._doc;
      return res.status(200).json({
        ...userInfo,
      });
    } else {
      return res.status(200).json(null);
    }

  } else {
    return res.status(200).json(null);
  }
};

export const updateUser = async (req, res, next) => {
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
    return userErrors.unauthorized(next);
  }
};

// 회원 탈퇴
export const deleteUser = async (req, res, next) => {
  const { user } = req;
  if (user) {
    // 좋아요 삭제
    await Like.deleteMany({ user: user._id });
    // 작성한 문장 삭제
    await Sentence.deleteMany({ author: user._id });
    // 사용자 정보 삭제
    await User.findByIdAndDelete(user._id);
    // 토큰 취소
    await admin.auth().revokeRefreshTokens(user.uid);
    // firebase auth에서 삭제
    await admin.auth().deleteUser(user.uid);

    return res.status(200).json('회원 탈퇴하였습니다.');
  } else {
    return userErrors.unauthorized(next);
  }
};

// 사용자가 작성한 문장 목록
export const getUserSentence = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = -1,
    } = req.query;
    const sort = { [sortBy]: Number(sortOrder) };
    const skip = calculateSkip(page, limit);

    const sentences = await Sentence.find({ author: userId }, '-firestoreId')
      .limit(limit)
      .skip(skip)
      .sort(sort);

    const list = await Promise.all(
      sentences.map((sentence) => findSentenceDetails(sentence, userId))
    );

    const total = await Sentence.countDocuments({ author: userId });

    return res.status(200).json({
      list,
      page: Number(page),
      limit: Number(limit),
      total: Number(total),
      pageTotal: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

// 사용자가 좋아요를 누른 목록
export const getUserLike = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const {
      page = 1,
      limit = 20,
      category = 'sentence',
      sortBy = 'createdAt',
      sortOrder = -1,
    } = req.query;
    const skip = calculateSkip(page, limit);
    const sort = { [sortBy]: Number(sortOrder) };
    const filter = { category, user: userId };
    const likes = await Like.find(filter).limit(limit).skip(skip).sort(sort);
    const total = await Like.countDocuments(filter);
    const sentences = await Promise.all(
      likes.map((like) => Sentence.findById(like.target, '-firestoreId'))
    );
    const list = await Promise.all(
      sentences.map((sentence) => findSentenceDetails(sentence, userId))
    );
    return res
      .status(200)
      .json({ total, page, limit, list, pageTotal: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};
