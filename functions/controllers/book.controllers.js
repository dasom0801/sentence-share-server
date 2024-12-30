import Book from '../models/book.model.js';
import Sentence from '../models/sentence.model.js';
import {
	getUserFromToken,
	getPaginationResult,
	calculateSkip,
	findSentenceDetails,
} from '../utils/utils.js';

import { bookErrors, userErrors } from '../utils/errors.js';

export const getBook = async (req, res, next) => {
	try {
		const { id } = req.params;
		const book = await Book.findById(id, '-firestoreId');
		if (!book) {
			return bookErrors.notFound(next);
		}
		return res.status(200).json(book);
	} catch (error) {
		next(error);
	}
};

export const getBookSentences = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { page = 1, limit = 20, mine } = req.query;
		const skip = calculateSkip(page, limit);
		const sort = { createdAt: -1 };
		const book = await Book.findById(id);

		if (!book) {
			return bookErrors.notFound(next);
		}

		const filter = { book: book._id };
		const user = await getUserFromToken(req);

		// 로그인한 사용자가 작성한 문장만 가져오는 경우
		if (mine) {
			if (!user) {
				return userErrors.loginRequired(next);
			}
			filter.author = user._id;
		}
		const sentences = await Sentence.find(filter)
			.sort(sort)
			.limit(limit)
			.skip(skip);

		const list = await Promise.all(
			sentences.map((sentence) => findSentenceDetails(sentence, user?._id))
		);
		const total = await Sentence.countDocuments(filter);

		return res.status(200).json({
			...getPaginationResult({
				page,
				limit,
				list,
				total,
			}),
		});
	} catch (error) {
		next(error);
	}
};
