const createError = (message, status) => {
	const error = new Error(message);
	error.status = status;
	return error;
};

const userErrors = {
	loginRequired(next) {
		next(createError('로그인 후 이용해주세요.', 401));
	},
	unauthorized(next) {
		next(createError('권한이 없습니다.', 401));
	},
};

const bookErrors = {
	notFound(next) {
		next(createError('등록된 책이 없습니다.', 404));
	},
};

const sentenceErrors = {
	notFound(next) {
		next(createError('문장을 찾을 수 없습니다.', 404));
	},
};

export { bookErrors, userErrors, sentenceErrors };
