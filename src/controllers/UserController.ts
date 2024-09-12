import { NextFunction, Request, Response } from 'express';

import User from '../models/userModel';
import { JSONResponse, ResponseStatus } from './AuthController';

import { get } from './decorators/routes';
import { controller } from './decorators/controller';

@controller('')
class UserController {
  @get('/users')
  async getAllUsers(
    req: Request,
    res: Response<JSONResponse>,
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
