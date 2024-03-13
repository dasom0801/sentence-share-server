import axios from 'axios';
import Like from '../models/like.model.js';
import Sentence from '../models/sentence.model.js';
import {
  calculateSkip,
  findSentenceDetails,
  getUserFromToken,
  getPaginationResult,
} from '../utils/utils.js';
import Book from '../models/book.model.js';

// 문장 전체 목록 가져오기
export const getSentences = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = calculateSkip(page, limit);
    const sort = { createdAt: -1 };
    const sentences = await Sentence.find().sort(sort).limit(limit).skip(skip);
    const user = await getUserFromToken(req);
    const list = await Promise.all(
      sentences.map((sentence) => findSentenceDetails(sentence, user?.userId))
    );
    const total = await Sentence.countDocuments();

    return res.status(200).json({
      ...getPaginationResult({ page, limit, total, list }),
    });
  } catch (error) {
    next(error);
  }
};

export const getSentence = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sentence = await Sentence.findById(id);
    if (!sentence) {
      const error = new Error('문장을 찾을 수 없습니다.');
      error.status = 404;
      throw error;
    }
    const result = await findSentenceDetails(sentence);
    return res.status(200).json({ ...result });
  } catch (error) {
    next(error);
  }
};

// kakao api로 책 검색
export const searchBook = async (req, res, next) => {
  try {
    const { query, page = 1, limit = 20, target = 'title' } = req.query;
    const convertToBookType = (book) => {
      const { authors, isbn, publisher, title, thumbnail, datetime } = book;
      return {
        title,
        coverUrl: thumbnail,
        publisher,
        author: authors,
        isbn,
        publishedAt: datetime,
      };
    };
    const { documents: list, meta } = (
      await axios.get(
        `https://dapi.kakao.com/v3/search/book?query=${query}&page=${page}&size=${limit}&target=${target}`,
        {
          headers: {
            Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}`,
          },
        }
      )
    ).data;
    return res.status(200).json({
      ...getPaginationResult({
        page,
        limit,
        total: meta.pageable_count,
        list: list.map(convertToBookType),
      }),
    });
  } catch (error) {
    next(error);
  }
};

export const createSentence = async (req, res, next) => {
  try {
    const { content, book } = req.body;
    const { user } = req;
    const { title, coverUrl, publisher, author, isbn, publishedAt } = book;
    const foundBook = await Book.findOne({ isbn });
    let bookId = foundBook?._id;

    // 저장된 책이 아니면 새로 만든다.
    if (!foundBook) {
      const newBook = await Book.create({
        title,
        coverUrl,
        publisher,
        author,
        isbn,
        publishedAt,
      });
      bookId = newBook._id;
    }
    const newSentence = await Sentence.create({
      content,
      book: bookId,
      author: user._id,
    });

    return res.status(200).json({
      message: '문장을 추가했습니다.',
      result: newSentence,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSentence = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content, book } = req.body;
    const updatedSentence = await Sentence.findByIdAndUpdate(
      id,
      { content, book: book._id },
      { new: true }
    );

    return res.status(200).json({
      message: '문장을 수정했습니다.',
      result: updatedSentence,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleSentenceLike = async (req, res, next) => {
  try {
    const { user } = req;
    const { id } = req.params;
    const likeTarget = {
      user: user._id,
      target: id,
      category: 'sentence',
    };
    const sentence = await Sentence.findById(id, '-firestoreId');
    const foundLike = await Like.findOne(likeTarget);
    if (foundLike) {
      await Like.findOneAndDelete({ _id: foundLike._id });
      sentence.likes--;
    } else {
      await Like.create(likeTarget);
      sentence.likes++;
    }
    await sentence.save();
    const sentenceDetail = await findSentenceDetails(sentence, user._id);
    return res.status(200).json(sentenceDetail);
  } catch (error) {
    next(error);
  }
};

export const deleteSentence = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user } = req;
    const sentence = await Sentence.findById(id);
    if (!sentence) {
      const error = new Error();
      error.message = '해당 문장을 찾을 수 없습니다.';
      error.status = 404;
      throw error;
    }

    if (sentence.author._id.toString() !== user._id.toString()) {
      const error = new Error();
      error.message = '삭제 권한이 없습니다.';
      error.status = 401;
      throw error;
    }
    await Like.deleteMany({ target: id, category: 'sentence' });
    await Sentence.findByIdAndDelete(id);
    return res.status(200).json(true);
  } catch (error) {
    next(error);
  }
};
