import { RequestHandler } from 'express';
import 'reflect-metadata';
import express from 'express';

export const router = express.Router();

export function controller(prefixPath: string): ClassDecorator {
  return function (target: Function): void {
    for (const key in target.prototype) {
      const path = Reflect.getMetadata('path', target.prototype, key) as string;
      const method = target.prototype[key] as RequestHandler;

      // console.log({ prefixPath, path });

      router.post(`${prefixPath}${path}`, method);
      router.get(`${prefixPath}${path}`, method);
    }
  };
}
