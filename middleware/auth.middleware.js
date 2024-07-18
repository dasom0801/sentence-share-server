import { getUserFromToken } from '../utils/utils.js';

export const authGuard = async (req, res, next) => {
	const throwError = () => {
		const err = new Error('Not authorized');
		err.statusCode = 401;
		next(err);
	};
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			const user = await getUserFromToken(req);
			if (!user) {
				throwError();
			}
			req.user = user;
			next();
		} catch (error) {
			throwError();
		}
	} else {
		throwError();
	}
};
