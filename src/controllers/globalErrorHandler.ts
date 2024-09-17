import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/AppError';
import ResponseStatus from './enums/ResponseStatus';

const { NODE_ENV } = process.env;

const handleValidationError = (err: AppError): AppError => {
  const message = err.message
    .split(':')
    .slice(1)
    .join('')
    .toLocaleLowerCase()
    .trim();
  return new AppError(message, 400);
};

const handleInvalidJwtError = (): AppError =>
  new AppError('Invalid token', 400);
const handleExpiredJwtError = (): AppError =>
  new AppError('Token expired', 400);

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

  let error = err;

  if (error.name === 'ValidationError') error = handleValidationError(err);
  if (error.name === 'JsonWebTokenError') error = handleInvalidJwtError();
  if (error.name === 'TokenExpiredError') error = handleExpiredJwtError();

  if (NODE_ENV === 'development') return sendErrorDevelopment(error, res);

  if (NODE_ENV === 'production') {
    if (error.isOperational) {
      return sendErrorProduction(error, res);
    } else {
      return sendUncaughtError(res);
    }
  }
};

export default globalErrorHandler;
