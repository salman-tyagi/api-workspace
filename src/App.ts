import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';

const { NODE_ENV, PORT, DB } = process.env;

import { router } from './controllers/decorators';

import './controllers/AuthController';
import './controllers/UserController';

import AppError from './utils/AppError';
import globalErrorHandler from './controllers/globalErrorHandler';

class App {
  private app: express.Express = express();

  constructor() {
    this.connectDB(DB!);

    this.app.use(helmet());
    this.app.use(morgan('dev'));
    this.app.use(express.json());

    this.app.use('/api/v1', router);

    this.app.all('*', (req: Request, res: Response, next: NextFunction) =>
      next(new AppError(`${req.originalUrl} does not exist`, 404))
    );

    this.app.use(globalErrorHandler);

    this.app.listen(Number(PORT), '127.0.0.1', () =>
      console.log(`Listening on the port ${PORT} in ${NODE_ENV}`)
    );
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
