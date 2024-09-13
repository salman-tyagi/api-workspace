import { Request, Response, NextFunction } from 'express';

import IUser from '../models/interfaces/IUser';
import IResponse from './interfaces/IResponse';
import User from '../models/userModel';
import { post, controller, bodyValidator } from './decorators';

import ResponseStatus from './enums/ResponseStatus';

@controller('/auth')
class AuthController {
  @post('/signup')
  @bodyValidator('name, email, password, confirmPassword')
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
