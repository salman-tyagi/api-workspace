import { Request, Response, NextFunction } from 'express';

import IUser from '../models/interfaces/IUser';
import IResponse from './interfaces/IResponse';
import ResponseStatus from './enums/ResponseStatus';
import User from '../models/userModel';
import { post, controller, bodyValidator, get, patch, use } from './decorators';

import AppError from '../utils/AppError';
import SendMail from '../utils/SendMail';
import { generateJwt, generateRandomToken, verifyJwt } from '../utils/helpers';
import { IUpdateUserRequest } from './interfaces/IUpdateUserRequest';
import { protect } from '../middlewares/protect';

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

      const verifyToken = generateJwt(
        { _id: newUser._id },
        process.env.EMAIL_VERIFY_JWT_SECRET_KEY!,
        process.env.EMAIL_VERIFY_JWT_EXPIRES_IN!
      );

      const verifyEmailLink = `${req.protocol}://${req.get(
        'host'
      )}/api/v1/auth/verify-user/${verifyToken}`;

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
    req: Request<{}, {}, { email: string; password: string }>,
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

      const token = generateJwt(
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

  @get('/verify-user/:token')
  async verifyUser(
    req: Request<{ token: string }>,
    res: Response<IResponse>,
    next: NextFunction
  ) {
    try {
      const { token } = req.params;
      if (!token) return next(new AppError('Please provide token', 400));

      const decode = verifyJwt(token, process.env.EMAIL_VERIFY_JWT_SECRET_KEY!);

      const user = await User.findOneAndUpdate(
        { _id: decode._id },
        { $set: { verified: true } }
      );
      if (!user) return next(new AppError('Link expired', 401));

      return res.status(200).json({
        status: ResponseStatus.Success,
        message: 'Email verified successfully'
      });
    } catch (err) {
      next(err);
    }
  }

  @post('/forgot-password')
  @bodyValidator('email')
  async forgotPassword(
    req: Request<{}, {}, { email: string }>,
    res: Response<IResponse>,
    next: NextFunction
  ) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email }, { name: 1, email: 1 });
      if (!user) return next(new AppError('Incorrect email address', 400));

      const resetToken = generateRandomToken(32);
      user.passwordResetToken = resetToken;
      user.passwordResetTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      const resetLink = `${req.protocol}://${req.get(
        'host'
      )}/api/v1/auth/reset-password/${resetToken}`;

      SendMail.resetPasswordMail({
        name: user.name,
        email: user.email,
        link: resetLink
      });

      return res.status(200).json({
        status: ResponseStatus.Success,
        message: 'Email sent successfully. Please check your mail'
      });
    } catch (err) {
      next(err);
    }
  }

  @post('/reset-password/:resetToken')
  @bodyValidator('password', 'confirmPassword')
  async resetPassword(
    req: Request<
      { resetToken: string },
      {},
      { password: string; confirmPassword: string }
    >,
    res: Response<IResponse>,
    next: NextFunction
  ) {
    try {
      const { resetToken } = req.params;
      const { password, confirmPassword } = req.body;

      const user = await User.findOne({
        passwordResetToken: resetToken,
        passwordResetTokenExpiresAt: { $gt: Date.now() }
      });

      if (!user) return next(new AppError('Reset link expired. Please reset your password again', 400));

      user.password = password;
      user.confirmPassword = confirmPassword;
      user.passwordResetToken = undefined!;
      user.passwordResetTokenExpiresAt = undefined!;
      user.passwordChangedAt = new Date();
      await user.save({ validateBeforeSave: true });

      return res.status(201).json({
        status: ResponseStatus.Success,
        message: 'Password changed successfully'
      });
    } catch (err) {
      next(err);
    }
  }

  @patch('/update-profile')
  @bodyValidator('name', 'email')
  @use(protect)
  async updateUser(
    req: IUpdateUserRequest,
    res: Response<IResponse>,
    next: NextFunction
  ) {
    try {
      const { name, email } = req.body;

      const user = await User.findOneAndUpdate(
        { _id: req.user?._id },
        { $set: { name, email } }
      );
      if (!user) return next(new AppError('No user found', 404));

      return res.status(201).json({
        status: ResponseStatus.Success,
        message: 'User updated successfully'
      });
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
