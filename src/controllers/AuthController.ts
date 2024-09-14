import { Request, Response, NextFunction } from 'express';

import IUser from '../models/interfaces/IUser';
import IResponse from './interfaces/IResponse';
import User from '../models/userModel';
import { post, controller, bodyValidator } from './decorators';

import ResponseStatus from './enums/ResponseStatus';
import AppError from '../utils/AppError';

interface ILogin {
  email: string;
  password: string;
}

@controller('/auth')
class AuthController {
  @post('/signup')
  @bodyValidator('name', 'email', 'password', 'confirmPassword')
  async signup(
    req: Request<{}, {}, IUser>,
    res: Response<IResponse>,
    next: NextFunction
  ) {
    try {
      const newUser = await User.create(req.body);
      newUser.password = undefined;

      return res.status(201).json({
        status: ResponseStatus.Success,
        data: newUser
      });
    } catch (err) {
      next(err);
    }
  }

  @post('/login')
  @bodyValidator('email', 'password')
  async login(
    req: Request<{}, {}, ILogin>,
    res: Response<IResponse>,
    next: NextFunction
  ) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return next(new AppError('Incorrect email or password', 401));
      }

      const token = 'token';

      return res.status(200).json({
        status: ResponseStatus.Success,
        token
      });
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
