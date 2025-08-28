import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { CreateReferenceRangeDtoWithoutTestId } from '../modules/reference_ranges/dto/create-reference_range.dto';
import { AppBaseEntityIdDataType } from '@common/entity/BaseEntity';
import { ResultValueTypeEnum } from '@common/enums/result-value-type.enum';
import { CreateResultValueOptionWithOutTestId } from '../modules/result_value_options/dto/create-result_value_option.dto';

export class CreateTestDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumberString()
  price: string;

  @IsNotEmpty()
  @IsEnum(ResultValueTypeEnum, {
    message: 'resultValueType must be one of: Numeric, Text, Categorical',
  })
  resultValueType: ResultValueTypeEnum;

  @ValidateIf((o) => o.resultValueType === ResultValueTypeEnum.CATEGORICAL)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateResultValueOptionWithOutTestId)
  @IsDefined({
    message: 'resultValueOptions is required for categorical tests',
  })
  resultValueOptions?: CreateResultValueOptionWithOutTestId[];

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  testUnitId: AppBaseEntityIdDataType;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  medicalDepartmentId: AppBaseEntityIdDataType;

  @IsArray()
  @IsDefined({ message: 'specimenRequirements is required' })
  @Type(() => SpecimenRequirement)
  @ValidateNested({ each: true })
  specimenRequirements: SpecimenRequirement[];

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
