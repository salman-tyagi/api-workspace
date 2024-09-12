import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/AppError';

const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('💥💥💥', err);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

export default globalErrorHandler;
