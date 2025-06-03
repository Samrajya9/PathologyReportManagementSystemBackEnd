import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Validate,
  ValidateIf,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'MaxGreaterThanMin', async: false })
export class MaxGreaterThanMinValidator
  implements ValidatorConstraintInterface
{
  validate(max: string, args: ValidationArguments) {
    const min = args.object[args.constraints[0]];
    if (!min || !max) return true;
    return parseFloat(max) > parseFloat(min);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Maximum range must be greater than minimum range';
  }
}

export class CreateTestDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumberString()
  price: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  testUnitId: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  medicalDepartmentId: number;

  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  categoryIds: number[];

  @IsOptional()
  @IsNumberString(
    {},
    {
      message: 'normalRangeMin must be a number string',
    },
  )
  normalRangeMin?: string;

  @IsOptional()
  @IsNumberString(
    {},
    {
      message: 'normalRangeMax must be a number string',
    },
  )
  @ValidateIf((o) => o.normalRangeMin !== undefined)
  @Validate(MaxGreaterThanMinValidator, ['normalRangeMin'])
  normalRangeMax?: string;
}
