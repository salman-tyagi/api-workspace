import { RequestHandler } from 'express';
import 'reflect-metadata';

import MetadataKeys from './metadataKeys';

export function use(middleware: RequestHandler): MethodDecorator {
  return function (
    target: Object,
    key: string | symbol,
    desc: PropertyDescriptor
  ): void {
    Reflect.defineMetadata(MetadataKeys.Middleware, middleware, target, key);
  };
}
