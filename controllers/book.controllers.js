import Book from '../models/book.model.js';
import Sentence from '../models/sentence.model.js';
import {
  getUserFromToken,
  getPaginationResult,
  calculateSkip,
} from '../utils/utils.js';

export const getBookSentences = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20, mine } = req.query;
    const skip = calculateSkip(page, limit);
    const sort = { updatedAt: -1 };
    const book = await Book.findById(id);

    if (!book) {
      const error = new Error('등록된 책이 없습니다.');
      error.status = 404;
      throw error;
    }

    const filter = { book: book._id };

    // 로그인한 사용자가 작성한 문장만 가져오는 경우
    if (mine) {
      const user = await getUserFromToken(req);
      if (!user) {
        const error = new Error('로그인 후 이용해주세요.');
        error.status = 401;
        throw error;
      }
      filter.author = user._id;
    }
    const list = await Sentence.find(filter).sort(sort).limit(limit).skip(skip);
    const total = await Sentence.countDocuments(filter);

    return res.status(200).json({
      ...getPaginationResult({ page, limit, list, total }),
    });
  } catch (error) {
    next(error);
  }
};
