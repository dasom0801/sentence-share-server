import Like from '../models/like.model.js';
import Sentence from '../models/sentence.model.js';
import { calculateSkip, findSentenceDetails, getUserFromToken } from '../utils/utils.js';


// 문장 전체 목록 가져오기
export const getSentences = async (req, res, next) => {
  try {
    const { page  = 1, limit = 20 } = req.query;
    const skip = calculateSkip(page, limit);
    const sort = {createdAt: -1 };
    const sentences = await Sentence.find().sort(sort).limit(limit).skip(skip);
    const user = await getUserFromToken(req);
    const list = await Promise.all(sentences.map(sentence => findSentenceDetails(sentence, user?.userId)));
    const total = await Sentence.countDocuments();
    
    return res.status(200).json({
      list,
      page: Number(page),
      limit: Number(limit),
      total: Number(total),
      pageTotal: Math.ceil(total/limit)
    });
  } catch (error) {
    next(error)
  }
}

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
