import 'reflect-metadata';

export function post(path: string): MethodDecorator {
  return function (
    target: Object,
    key: string | symbol,
    desc: PropertyDescriptor
  ): void {
    Reflect.defineMetadata('path', path, target, key);
  };
}

export function get(path: string): MethodDecorator {
  return function (
    target: Object,
    key: string | symbol,
    desc: PropertyDescriptor
  ): void {
    Reflect.defineMetadata('path', path, target, key);
  };
}
