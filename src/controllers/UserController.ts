import { NextFunction, Request, Response } from 'express';

import IResponse from './interfaces/IResponse';
import User from '../models/userModel';
import { get, controller, use } from './decorators';

import ResponseStatus from './enums/ResponseStatus';
import AppError from '../utils/AppError';
import { verifyJwt } from '../utils/helpers';

const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ').at(1);
    if (!token) return next(new AppError('You are not logged in.', 403));

    const decode = verifyJwt(token, process.env.JWT_ACCESS_TOKEN_SECRET!);

    const user = await User.findOne({ _id: decode._id });
    if (!user) return next(new AppError('User not found with this token', 404));

    return next();
  } catch (err) {
    return next(err);
  }
};

@controller('')
class UserController {
  @get('/users')
  @use(protect)
  async getAllUsers(
    req: Request,
    res: Response<IResponse>,
    next: NextFunction
  ) {
    try {
      const users = await User.find();

      return res.status(200).json({
        status: ResponseStatus.Success,
        result: users.length,
        data: users
      });
    } catch (err) {
      return next(err);
    }
  }
}

export default UserController;
