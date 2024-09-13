import { NextFunction, Request, RequestHandler, Response } from 'express';

import IResponse from './interfaces/IResponse';
import User from '../models/userModel';
import { get, controller, use } from './decorators';

import ResponseStatus from './enums/ResponseStatus';

const logger = (): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    console.log('Get users api hit');
  };
};

@controller('')
class UserController {
  @get('/users')
  @use(logger)
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
