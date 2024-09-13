import { Request, Response, NextFunction } from 'express';

import User, { IUser } from '../models/userModel';
import { post, controller, use } from './decorators';
export interface IResponse {
  status: string;
  result?: number;
  data?: IUser | IUser[];
  message?: string;
}

export enum ResponseStatus {
  Success = 'success',
  Fail = 'fail',
  Error = 'error'
}

function logger(req: Request, res: Response, next: NextFunction): void {
  console.log('Middleware was called!');

  next();
  return;
}
@controller('/auth')
class AuthController {
  @post('/signup')
  @use(logger)
  async signup(
    req: Request<{}, {}, IUser>,
    res: Response<IResponse>,
    next: NextFunction
  ) {
    try {
      const newUser = await User.create(req.body);

      return res.status(201).json({
        status: ResponseStatus.Success,
        data: newUser
      });
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
