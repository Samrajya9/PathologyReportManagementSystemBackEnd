// validators/patient-id-or-profile.validator.ts
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsPatientIdOrProfile(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsPatientIdOrProfile',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(_: any, args: ValidationArguments) {
          const obj = args.object as any;

          const hasPatientId = !!obj.patientId;
          const hasProfile = !!obj.patient;

          // ❌ invalid if neither or both
          if (!hasPatientId && !hasProfile) return false;
          if (hasPatientId && hasProfile) return false;

          return true;
        },
        defaultMessage() {
          return `Either "patientId" or "patient" must be provided, but not both.`;
        },
      },
    });
  };
}
