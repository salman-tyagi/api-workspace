import { NextFunction, Request, Response } from 'express';

import IResponse from './interfaces/IResponse';
import User from '../models/userModel';
import { get, controller, use } from './decorators';

import ResponseStatus from './enums/ResponseStatus';
import { protect } from '../middlewares/protect';

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
