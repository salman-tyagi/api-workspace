import { NextFunction, Request, Response } from 'express';

import User from '../models/userModel';
import { IResponse, ResponseStatus } from './AuthController';
import { get, controller } from './decorators';

@controller('')
class UserController {
  @get('/users')
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
