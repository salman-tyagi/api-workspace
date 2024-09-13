// import 'reflect-metadata';
// import MetadataKeys from './metadataKeys';

// function bodyValidator(...keys: string[]): MethodDecorator {
//   return function (
//     target: Object,
//     key: string | symbol,
//     desc: PropertyDescriptor
//   ): void {
//     const middlewares =
//       Reflect.getMetadata(MetadataKeys.Validator, target, key) || [];

//     Reflect.defineMetadata(MetadataKeys.Validator, keys, target, key);
//   };
// }
