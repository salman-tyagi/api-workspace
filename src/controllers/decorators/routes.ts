import 'reflect-metadata';

import Methods from './methods';
import MetadataKeys from './metadataKeys';

function routeBinder(method: string) {
  return function (path: string): MethodDecorator {
    return function (
      target: Object,
      key: string | symbol,
      desc: PropertyDescriptor
    ): void {
      Reflect.defineMetadata(MetadataKeys.Path, path, target, key);
      Reflect.defineMetadata(MetadataKeys.Method, method, target, key);
    };
  };
}

export const get = routeBinder(Methods.Get);
export const post = routeBinder(Methods.Post);
export const patch = routeBinder(Methods.Patch);
export const put = routeBinder(Methods.Put);
export const del = routeBinder(Methods.Delete);
