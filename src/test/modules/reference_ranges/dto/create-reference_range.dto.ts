import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { AppBaseEntityIdDataType } from 'src/global/entity/BaseEntity';
import { Gender } from '../entities/reference_range.entity';
import { OmitType } from '@nestjs/mapped-types';

export class CreateReferenceRangeDto {
  @IsNotEmpty()
  testId: AppBaseEntityIdDataType;

  @IsNotEmpty()
  @IsNumberString()
  age_min_years: string;

  @IsNotEmpty()
  @IsNumberString()
  age_max_years: string;

  @IsOptional()
  @IsEnum(Gender)
  gender: string;

  @IsNumberString()
  @IsNotEmpty()
  normal_min: string;

  @IsNumberString()
  @IsNotEmpty()
  normal_max: string;

  @IsNumberString()
  @IsNotEmpty()
  critical_min: string;

  @IsNumberString()
  @IsNotEmpty()
  critical_max: string;

  @IsString()
  @IsOptional()
  notes: string;
}

export class CreateReferenceRangeDtoWithoutTestId extends OmitType(
  CreateReferenceRangeDto,
  ['testId'] as const,
) {}
