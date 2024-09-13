import { Request, Response, NextFunction } from 'express';

import User, { IUser } from '../models/userModel';
import { post, controller } from './decorators';
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

@controller('/auth')
class AuthController {
  @post('/signup')
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
