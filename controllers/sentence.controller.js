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
