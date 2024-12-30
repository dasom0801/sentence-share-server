import { getUserFromToken } from '../utils/utils.js';
import { userErrors } from '../utils/errors.js';

export const authGuard = async (req, res, next) => {
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			const user = await getUserFromToken(req);
			if (!user) {
				return userErrors.unauthorized(next);
			}
			req.user = user;
			next();
		} catch (error) {
			return userErrors.unauthorized(next);
		}
	} else {
		return userErrors.unauthorized(next);
	}
};
