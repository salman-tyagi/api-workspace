import { RequestHandler } from 'express';
import 'reflect-metadata';

import MetadataKeys from './metadataKeys';

export function use(middleware: RequestHandler): MethodDecorator {
  return function (
    target: Object,
    key: string | symbol,
    desc: PropertyDescriptor
  ): void {
    const middlewares = Reflect.getMetadata(
      MetadataKeys.Middleware,
      target,
      key
    ) || [];

    Reflect.defineMetadata(
      MetadataKeys.Middleware,
      [...middlewares, middleware],
      target,
      key
    );
  };
}
