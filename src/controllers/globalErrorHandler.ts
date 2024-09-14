import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/AppError';
import ResponseStatus from './enums/ResponseStatus';

const { NODE_ENV } = process.env;

const handleInvalidJwt = (): AppError => new AppError('Invalid token', 400);
const handleExpiredJwt = (): AppError => new AppError('Token expired', 400);

const sendErrorDevelopment = (err: AppError, res: Response) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

const sendErrorProduction = (err: AppError, res: Response) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message
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

  if (NODE_ENV === 'development') {
    sendErrorDevelopment(err, res);
  }

  if (NODE_ENV === 'production') {
    if (err.isOperational) {
      let error = err;

      if (err.name === 'JsonWebTokenError') error = handleInvalidJwt();
      if (err.name === 'TokenExpiredError') error = handleExpiredJwt();

      sendErrorProduction(error, res);
    } else {
      return res.status(500).json({
        status: ResponseStatus.Error,
        message: 'Something went wrong'
      });
    }
  }
};

export default globalErrorHandler;
