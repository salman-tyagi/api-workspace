import express, {
  NextFunction,
  Request,
  Response,
  RequestHandler
} from 'express';
import 'reflect-metadata';

import Methods from './methods';
import MetadataKeys from './metadataKeys';
import AppError from '../../utils/AppError';

export const router = express.Router();

const validateBody = (keys: string[]): RequestHandler => {
  return function (req: Request, res: Response, next: NextFunction): void {
    if (!req.body) {
      return next(new AppError('Invalid request', 400));
    }

    for (const key of keys) {
      if (!req.body[key]) {
        return next(new AppError(`Please provide ${key}.`, 400));
      }
    }

    return next();
  };
};

export function controller(prefixPath: string): ClassDecorator {
  return function (target: Function): void {
    for (const key in target.prototype) {
      const path: string = Reflect.getMetadata(
        MetadataKeys.Path,
        target.prototype,
        key
      );

      const handler: RequestHandler = target.prototype[key];

      const method: Methods = Reflect.getMetadata(
        MetadataKeys.Method,
        target.prototype,
        key
      );

      const middlewares: RequestHandler[] =
        Reflect.getMetadata(MetadataKeys.Middleware, target.prototype, key) ||
        [];

      const validator: string[] =
        Reflect.getMetadata(MetadataKeys.Validator, target.prototype, key) ||
        [];

      const middleware = validateBody(validator);

      if (path) {
        router[method](
          `${prefixPath}${path}`,
          [...middlewares, middleware],
          handler
        );
      }
    }
  };
}
