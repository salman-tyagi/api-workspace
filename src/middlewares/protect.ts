import { Response, NextFunction } from 'express';

import User from '../models/userModel';
import AppError from '../utils/AppError';
import { verifyJwt } from '../utils/helpers';
import IProtectRequest from './interfaces/IProtectRequest';


export const protect = async (req: IProtectRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ').at(1);
    if (!token) return next(new AppError('You are not logged in.', 403));

    const decode = verifyJwt(token, process.env.JWT_ACCESS_TOKEN_SECRET!);

    const user = await User.findOne({ _id: decode._id });
    if (!user) return next(new AppError('User not found with this token', 404));

    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
};