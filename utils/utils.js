import jwt from 'jsonwebtoken';

import Book from '../models/book.model.js';
import Like from '../models/like.model.js';
import User from '../models/user.model.js';

export const calculateSkip = (page, limit) => {
  return Math.max(Number(page - 1) * Number(limit), 0);
};

// Sentence에 추가되어야 하는 정보들을 찾아서 추가해준다.
export const findSentenceDetails = async (sentence, userId) => {
  const author = await User.findById(sentence.author, '_id name profileUrl');
  const book = await Book.findById(sentence.book, '-firestoreId');
  const { firestoreId, ...sentenceResult } = sentence._doc;
  let isLiked = false;

  // 로그인한 경우
  if (userId) {
    isLiked = !!(await Like.findOne({
      user: userId,
      category: 'sentence',
      target: sentence._id,
    }));
  }

  return {
    ...sentenceResult,
    author,
    book,
    isLiked,
  };
};

// token으로 user 정보를 찾아서 반환한다.
export const getUserFromToken = async (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const { userId } = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_PRIVATE_KEY
      );
      const user = await User.findById(userId);
      return user;
    } catch (error) {
      return null;
    }
  } else {
    return null;
  }
};

// params를 받아서 pagination 타입으로 반환한다.
export const getPaginationResult = ({ page, limit, list, total }) => {
  return {
    list,
    page: Number(page),
    limit: Number(limit),
    total: Number(total),
    pageTotal: Math.ceil(total / limit),
  };
};

export const generateUserToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
    expiresIn: '30m',
  });
};
