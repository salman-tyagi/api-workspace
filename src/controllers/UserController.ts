import { NextFunction, Request, Response } from 'express';

import User from '../models/userModel';
import { get, controller, use, del } from './decorators';
import { protect } from '../middlewares/protect';
import allowedTo from '../middlewares/allowedTo';

import IResponse from './interfaces/IResponse';
import IUser from '../models/interfaces/IUser';
import ResponseStatus from './enums/ResponseStatus';
import AppError from '../utils/AppError';

@controller('')
class UserController {
  @get('/users')
  @use(allowedTo('admin', 'user'))
  @use(protect)
  async getAllUsers(
    req: Request<IUser>,
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
      next(err);
    }
  }

  @get('/users/:id')
  @use(protect)
  async getUser(
    req: Request<{ id: string }>,
    res: Response<IResponse>,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const user = await User.findOne({ _id: id });
      if (!user) {
        return next(new AppError('User not found', 404));
      }

      return res.status(200).json({
        status: ResponseStatus.Success,
        data: user
      });
    } catch (err) {
      next(err);
    }
  }

  @use(allowedTo('admin'))
  @use(protect)
  @del('/users/:id')
  async deleteAccount(
    req: Request<{ id: string }>,
    res: Response<IResponse>,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      if (!id) return next(new AppError('Provide user id', 400));

      await User.findOneAndDelete({ _id: id });

      return res
        .status(204)
        .json({ status: ResponseStatus.Success, message: 'Account deleted' });
    } catch (err) {
      next(err);
    }
  }
}

export default UserController;
