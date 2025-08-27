import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateReferenceRangeDtoWithoutTestId } from '../modules/reference_ranges/dto/create-reference_range.dto';
import { AppBaseEntityIdDataType } from '@common/entity/BaseEntity';
import { ResultValueTypeEnum } from '@common/enums/result-value-type.enum';

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
  testUnitId: AppBaseEntityIdDataType;

  @IsArray()
  @IsDefined({ message: 'specimenRequirements is required' })
  @Type(() => SpecimenRequirement)
  @ValidateNested({ each: true })
  specimenRequirements: SpecimenRequirement[];

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  medicalDepartmentId: AppBaseEntityIdDataType;

  @IsNotEmpty()
  @IsEnum(ResultValueTypeEnum, {
    message: 'resultValueType must be one of: Numeric, Text, Categorical',
  })
  @Type(() => String)
  resultValueType: ResultValueTypeEnum;

  @IsArray()
  @IsDefined({ message: 'referenceRanges is required' })
  @ValidateNested({ each: true })
  @Type(() => CreateReferenceRangeDtoWithoutTestId)
  referenceRanges: CreateReferenceRangeDtoWithoutTestId[];
}

export class SpecimenRequirement {
  @IsNotEmpty()
  @IsInt()
  specimenId: number;

  @IsNotEmpty()
  @IsInt()
  containerId: number;
}
