import { Request, Response, NextFunction } from 'express';

import IUser from '../models/interfaces/IUser';
import IResponse from './interfaces/IResponse';
import User from '../models/userModel';
import { post, controller, bodyValidator } from './decorators';

import ResponseStatus from './enums/ResponseStatus';
import AppError from '../utils/AppError';
import SendMail from '../utils/SendMail';
import generateJWT from '../utils/generateJWT';

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
      newUser.password = undefined!;

      const token = generateJWT(
        { _id: newUser._id },
        process.env.EMAIL_VERIFY_JWT_SECRET_KEY!,
        process.env.EMAIL_VERIFY_JWT_EXPIRES_IN!
      );

      const verifyEmailLink = `${req.protocol}://${req.get(
        'host'
      )}/api/v1/verify-user/${token}`;

      SendMail.verifyEmail({
        name: newUser.name,
        email: newUser.email,
        link: verifyEmailLink
      });

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

      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return next(new AppError('Incorrect email or password', 401));
      }

      const isValidPassword = await user.validatePassword(
        password,
        user.password
      );

      if (!isValidPassword) {
        return next(new AppError('Incorrect email or password', 401));
      }

      if (!user.verified) {
        return next(new AppError('Please verify your email address', 401));
      }

      const token = generateJWT(
        { _id: user._id },
        process.env.JWT_ACCESS_TOKEN_SECRET!,
        process.env.JWT_ACCESS_TOKEN_EXPIRES_IN!
      );

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
