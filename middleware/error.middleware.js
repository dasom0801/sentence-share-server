export const errorResponseHandler = (error, req, res, next) => {
	if (process.env.NODE_ENV !== 'production') {
		console.log(error);
	}
	const statusCode = error.status || 500;
	res.status(statusCode).json({
		message: error.message,
		stack: process.env.NODE_ENV === 'production' ? null : error.stack,
	});
};

export const invalidPathHandler = (req, res, next) => {
	return res.status(404).send('invalid path');
};
