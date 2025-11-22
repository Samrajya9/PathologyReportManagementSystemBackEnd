import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDate,
  IsPhoneNumber,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { PatientCreatedBy } from '../entities/patient.entity';
import { Gender } from '../entities/patient-profile.entity';
import { OmitType } from '@nestjs/mapped-types';
import { AppBaseEntityIdDataType } from '@common/entity/BaseEntity';

export class CreatePatientProfileDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsDateString()
  dob: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender = Gender.MALE;
}

export class CreatePatientDto {
  @IsNotEmpty()
  @IsEnum(PatientCreatedBy)
  createdBy: PatientCreatedBy;

  @IsNotEmpty()
  // The ID of the creator (admin, partner, or user)
  createdById: AppBaseEntityIdDataType;

  @IsOptional()
  // The eventual owner of this patient record
  ownedById?: number;

  @ValidateNested()
  @Type(() => CreatePatientProfileDto)
  @IsNotEmpty()
  profile: CreatePatientProfileDto;
}

/**
 * Foe this the createdBy is dervied from req.user.role and createByid is also dervied from req.user.id
 */
export class CreatePatientByAdminDto extends OmitType(CreatePatientDto, [
  'createdBy',
  'createdById',
] as const) {}

/**
 * Alternative DTO if profile is created separately
 */
export class CreatePatientWithoutProfileDto extends OmitType(CreatePatientDto, [
  'profile',
]) {}
