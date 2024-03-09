import admin from '../config/firebase.config.js';
import Book from '../models/book.model.js';
import Like from '../models/like.model.js';
import User from '../models/user.model.js';

export const calculateSkip = (page, limit) => {
  return Math.max(Number(page - 1) * Number(limit), 0);
};

// Sentence에 추가되어야 하는 정보들을 찾아서 추가해준다.
export const findSentenceDetails = async (sentence, userId) => {
  const author = await User.findById(sentence.author, '_id name profileUrl');
  const book = await Book.findById(sentence.book, '_id title author coverUrl');
  let isLiked = false;

  // 로그인하지 않은 경우
  if (userId) {
    isLiked = !!await Like.findOne({
      user: userId,
      category: 'sentence',
      target: sentence._id,
    });
  }
  
  return {
    ...sentence._doc,
    author,
    book,
    isLiked
  };
};


export const getUserFromToken = async (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      const user = await User.findOne({ uid: decodedToken.uid });
      return user;
    } catch(error) {
      next(error)
    }
  } else {
    return null;
  }
}