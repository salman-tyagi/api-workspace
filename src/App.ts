import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';

import { router } from './controllers/decorators';

import './controllers/AuthController';
import './controllers/UserController';

import AppError from './utils/AppError';
import globalErrorHandler from './controllers/globalErrorHandler';

const { NODE_ENV, PORT = '', DB = '' } = process.env;

class App {
  private app: express.Express = express();

  constructor() {
    this.connectDB(DB);

    this.app.use(helmet());
    this.app.use(morgan('dev'));
    this.app.use(express.json());

    this.app.use('/api/v1', router);

    this.app.all('*', (req: Request, res: Response, next: NextFunction) => {
      return next(new AppError(`${req.originalUrl} does not exist`, 400));
    });

    this.app.use(globalErrorHandler);

    this.app.listen(Number(PORT), '127.0.0.1', () => {
      console.log(`Listening on the port ${PORT} in ${NODE_ENV}`);
    });
  }

  private async connectDB(uri: string) {
    try {
      await mongoose.connect(uri);
      console.log('DB connected successfully');

      if (NODE_ENV === 'development') {
        mongoose.set({ debug: true });
      }
    } catch (err) {
      console.log(err);
    }
  }
}

new App();
