import { IsAppBaseEntityId } from '@common/decorators/validators/app-base-entity-id.validator';
import { AppBaseEntityIdDataType } from '@common/entity/BaseEntity';
import { OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { TestRequestStatus } from '../entities/test-request.entity';
import { CreatePatientByAdminDto } from '@modules/patient/dto/create-patient.dto';
import { IsPatientIdOrProfile } from '@common/decorators/validators/patient-id-or-profile.validator';
import { TestStatus } from '../entities/requested-test.entity';

// create-test-request.dto.ts
export class CreateTestRequestDto {
  @IsNotEmpty()
  patientId: AppBaseEntityIdDataType;

  @IsOptional()
  @IsEnum(TestRequestStatus)
  status?: TestRequestStatus;
}
// create-requested-test.dto.ts
export class CreateRequestedTestDto {
  @IsOptional()
  @IsEnum(TestStatus)
  status?: TestStatus;

  @IsNotEmpty()
  testRequestId: AppBaseEntityIdDataType;

  @IsNotEmpty()
  testId: AppBaseEntityIdDataType;
}

// create-test-result.dto.ts
export class CreateTestResultDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  requestedTestId: number;

  @IsOptional()
  @IsString()
  resultValue?: string;
}

export class BatchCreateTestRequestDto {
  // ✔ testIds must be an array
  // ✔ Array must not be empty
  // ✔ Every item must be a valid integer
  // ✔ Incoming values like "1" are converted to numbers
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Type(() => Number)
  testIds: AppBaseEntityIdDataType[];

  @IsAppBaseEntityId()
  @IsNotEmpty()
  patientId: AppBaseEntityIdDataType;

  @IsOptional()
  @IsEnum(TestRequestStatus)
  status?: TestRequestStatus;
}

export class BatchCreateTestRequestWithPatientDto extends OmitType(
  BatchCreateTestRequestDto,
  ['patientId'],
) {
  // ---- MUTUAL EXCLUSIVE VALIDATION ----
  @IsPatientIdOrProfile()
  _exclusiveValidator: true; // “dummy” property required by class-validator

  @IsOptional()
  @IsAppBaseEntityId()
  @ValidateIf((o) => !o.patientProfile)
  patientId?: AppBaseEntityIdDataType;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePatientByAdminDto)
  @ValidateIf((o) => !o.patientId)
  patient?: CreatePatientByAdminDto;
}
