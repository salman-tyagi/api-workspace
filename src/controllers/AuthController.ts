import { Request, Response, NextFunction } from 'express';

import User, { IUser } from '../models/userModel';

import { post } from './decorators/routes';
import { controller } from './decorators/controller';
export interface JSONResponse {
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
    res: Response<JSONResponse>,
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
