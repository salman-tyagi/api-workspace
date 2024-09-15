import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/AppError';
import ResponseStatus from './enums/ResponseStatus';

const { NODE_ENV } = process.env;

const handleInvalidJwt = (): AppError => new AppError('Invalid token', 400);
const handleExpiredJwt = (): AppError => new AppError('Token expired', 400);

const sendErrorDevelopment = (err: AppError, res: Response): Response => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

const sendErrorProduction = (err: AppError, res: Response): Response => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
};

const sendUncaughtError = (res: Response): Response => {
  return res.status(500).json({
    status: ResponseStatus.Error,
    message: 'Something went wrong'
  });
};

const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('💥💥💥', err);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || ResponseStatus.Fail;

  if (NODE_ENV === 'development') return sendErrorDevelopment(err, res);

  if (NODE_ENV === 'production') {
    let error = err;

    if (error.name === 'JsonWebTokenError') error = handleInvalidJwt();
    if (error.name === 'TokenExpiredError') error = handleExpiredJwt();

    if (error.isOperational) {
      return sendErrorProduction(error, res);
    } else {
      return sendUncaughtError(res);
    }
  }
};

export default globalErrorHandler;
