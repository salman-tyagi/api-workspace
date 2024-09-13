import 'reflect-metadata';
import MetadataKeys from './metadataKeys';

export function bodyValidator(...keys: string[]): MethodDecorator {
  return function (
    target: Object,
    key: string | symbol,
    desc: PropertyDescriptor
  ): void {
    const validator =
      Reflect.getMetadata(MetadataKeys.Validator, target, key) || [];

    Reflect.defineMetadata(
      MetadataKeys.Validator,
      [...validator, ...keys],
      target,
      key
    );
  };
}
