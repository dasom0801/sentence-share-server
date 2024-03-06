import Like from '../models/like.model.js';
import Sentence from '../models/sentence.model.js';
import { findSentenceDetails } from '../utils/utils.js';

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
