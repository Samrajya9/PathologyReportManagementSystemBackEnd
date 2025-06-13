import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
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

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  specimenId: AppBaseEntityIdDataType;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  medicalDepartmentId: AppBaseEntityIdDataType;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  resultValueTypeId: AppBaseEntityIdDataType;

  @IsNotEmpty({ each: true, message: 'Each categoryId is required' })
  @IsNumber({}, { each: true, message: 'Each categoryId must be a number' })
  @Type(() => Number)
  categoryIds: AppBaseEntityIdDataType[];

  @IsArray()
  @ValidateNested({ each: true })
  @IsDefined({ message: 'referenceRanges is required' }) // 👈 Force presence
  @Type(() => CreateReferenceRangeDtoWithoutTestId)
  referenceRanges: CreateReferenceRangeDtoWithoutTestId[];
}
