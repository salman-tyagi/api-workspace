import express, { RequestHandler } from 'express';
import 'reflect-metadata';

import Methods from './methods';
import MetadataKeys from './metadataKeys';

export const router = express.Router();

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

      const middleware =
        Reflect.getMetadata(MetadataKeys.Middleware, target.prototype, key) ||
        [];

      // console.log({ method, prefixPath, path, middleware, handler });

      if (path) {
        router[method](`${prefixPath}${path}`, middleware, handler);
      }
    }
  };
}
