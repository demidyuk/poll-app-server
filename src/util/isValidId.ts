import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import * as shortid from 'shortid';

export function IsValidId(
  canBeUndefined: boolean = false,
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isValidId',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (canBeUndefined && value == null) {
            return true;
          }
          return shortid.isValid(value);
        },
      },
    });
  };
}
