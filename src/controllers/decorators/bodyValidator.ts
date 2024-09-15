import 'reflect-metadata';
import MetadataKeys from './metadataKeys';

export function bodyValidator(...keys: string[]): MethodDecorator {
  return function (
    target: Object,
    key: string | symbol,
    desc: PropertyDescriptor
  ): void {
    Reflect.defineMetadata(MetadataKeys.Validator, keys, target, key);
  };
}
