import { Request, Response, NextFunction, RequestHandler } from 'express';
import 'reflect-metadata';

import User, { IUser } from '../models/userModel';

interface JSONResponse {
  status: string;
  data: IUser;
}

class AuthController {
  async signup(
    req: Request<{}, {}, IUser>,
    res: Response<JSONResponse>,
    next: NextFunction
  ) {
    try {
      const newUser = await User.create(req.body);

      return res.status(201).json({
        status: 'success',
        data: newUser
      });
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
