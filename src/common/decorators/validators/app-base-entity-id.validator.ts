import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsAppBaseEntityId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isAppBaseEntityId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return (
            typeof value === 'number' && Number.isInteger(value) && value > 0
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a integer`;
        },
      },
    });
  };
}
