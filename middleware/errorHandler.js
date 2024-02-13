export const errorResponseHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? null : error.stack,
  });
};

export const invalidPathHandler = (req, res, next) => {
  let error = new Error('Invalid Path');
  error.statusCode = 404;
  next(error);
};
