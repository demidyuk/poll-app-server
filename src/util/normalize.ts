import { __id } from './__id';

/* tslint:disable:only-arrow-functions*/
export function normalize() {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const f = descriptor.value;
    descriptor.value = async function(...args) {
      return __id(await f.apply(this, args));
    };
  };
}
