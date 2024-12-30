import { body, validationResult } from 'express-validator';

// validation 결과 확인
export const validationErrorHandler = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error('잘못된 요청입니다.');
		error.status = 400;
		error.errors = errors.array();
		next(error);
	}
	next();
};

export const validateSentence = [
	body('content').trim().isLength({ min: 5 }),
	body('book').custom(async (value) => {
		if (!value) {
			const error = new Error('책 정보를 입력해주세요.');
			error.status = 400;
			next(error);
		}
		// 새로운 책을 등록하는 경우에는 필수값을 확인한다.
		const { title, publisher, author, isbn } = value;
		if (!title || !publisher || !author || !isbn) {
			const error = new Error('책 정보가 잘못되었습니다.');
			error.status = 400;
			next(error);
		} else {
			return true;
		}
	}),
	validationErrorHandler,
];
