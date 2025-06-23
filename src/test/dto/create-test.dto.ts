import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateReferenceRangeDtoWithoutTestId } from '../modules/reference_ranges/dto/create-reference_range.dto';
import { AppBaseEntityIdDataType } from 'src/global/entity/BaseEntity';

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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => specimenRequirement)
  specimenRequirements?: specimenRequirement[];

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  medicalDepartmentId: AppBaseEntityIdDataType;

  @IsNotEmpty()
  @IsNumber({}, { message: `resultValueTypeId must be a number` })
  @Type(() => Number)
  resultValueTypeId: AppBaseEntityIdDataType;

  @IsNotEmpty({ each: true, message: 'Each categoryId is required' })
  @IsNumber({}, { each: true, message: 'Each categoryId must be a number' })
  @Type(() => Number)
  categoryIds: AppBaseEntityIdDataType[];

  @IsArray()
  @IsDefined({ message: 'referenceRanges is required' }) // 👈 Force presence
  @ValidateNested({ each: true })
  @Type(() => CreateReferenceRangeDtoWithoutTestId)
  referenceRanges: CreateReferenceRangeDtoWithoutTestId[];
}

export class specimenRequirement {
  @IsNotEmpty()
  @IsInt()
  specimenId: number;

  @IsNotEmpty()
  @IsInt()
  containerId: number;
}
