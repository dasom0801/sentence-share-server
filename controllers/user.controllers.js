import Book from '../models/book.model.js';
import Like from '../models/like.model.js';
import Sentence from '../models/sentence.model.js';
import User from '../models/user.model.js';
import { calculateSkip } from '../utils/utils.js';

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

// 작성자와 책 정보를 찾아서 추가한다.
const findSentenceDetails = async (sentence) => {
  const author = await User.findById(sentence.author, '_id name profileUrl');
  const book = await Book.findById(sentence.book, '_id title author coverUrl');
  return {
    ...sentence._doc,
    author,
    book,
  };
};

export const getUserSentence = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = calculateSkip(page, limit);

    const sentences = await Sentence.find({ author: userId }, '-firestoreId')
      .limit(limit)
      .skip(skip);

    const list = await Promise.all(
      sentences.map((sentence) => findSentenceDetails(sentence))
    );

    const total = await Sentence.countDocuments({ author: userId });

    return res.status(200).json({
      list,
      page: Number(page),
      limit: Number(limit),
      total: Number(total),
    });
  } catch (error) {
    next(error);
  }
};

export const getUserLike = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, category = 'sentence' } = req.query;
    const skip = calculateSkip(page, limit);
    const filter = { category, user: userId };
    const likes = await Like.find(filter).limit(limit).skip(skip);
    const total = await Like.countDocuments(filter);
    const sentences = await Promise.all(
      likes.map((like) => Sentence.findById(like.target, '-firestoreId'))
    );
    const list = await Promise.all(
      sentences.map((sentence) => findSentenceDetails(sentence))
    );
    return res.status(200).json({ total, page, limit, list });
  } catch (error) {
    next(error);
  }
};
