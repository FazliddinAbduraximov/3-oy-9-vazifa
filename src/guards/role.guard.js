import { AppError } from "../error/AppError.js";

export const RolesGuard = (...roles) => {
    return function (req, res, next) {
        try {
            if (req?.user?.role && roles.includes(req?.user?.role) || roles.includes('ID') && req.params?.id == req.user?.id) {
                return next();
            }
            throw new AppError('Forbidden user',403);
        } catch (error) {
            next(error);
        }
    }
}