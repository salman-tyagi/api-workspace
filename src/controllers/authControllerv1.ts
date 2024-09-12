import { NextFunction, Request, Response } from 'express';

import User from '../models/userModel';

interface RequestWithBody {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const signup = async (
  req: Request<{}, {}, RequestWithBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const payload = { name, email, password, confirmPassword };

    const newUser = await User.create(payload);

    return res.status(201).json({
      status: 'success',
      data: newUser
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (err) {
    next(err);
  }
};
