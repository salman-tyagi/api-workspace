import { Response, NextFunction, RequestHandler } from 'express';
import AppError from '../utils/AppError';
import IProtectRequest from './interfaces/IProtectRequest';

const allowedTo = (...roles: string[]): RequestHandler => {
  return async (
    req: IProtectRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!roles.includes(req.user!.role)) {
        return next(new AppError('You are forbidden to get access', 403));
      }

      return next();
    } catch (err) {
      next(err);
    }
  };
};

export default allowedTo;
