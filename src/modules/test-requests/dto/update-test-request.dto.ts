import { PartialType } from '@nestjs/mapped-types';
import {
  BatchCreateTestRequestWithPatientDto,
  CreateTestRequestDto,
} from './create-test-request.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TestStatus } from '../entities/requested-test.entity';

export class UpdateTestRequestDto extends PartialType(CreateTestRequestDto) {}

export class UpdateTestRequestByAdminDto extends PartialType(
  BatchCreateTestRequestWithPatientDto,
) {}

export class UpdateTestResultDto {
  @IsOptional()
  @IsString()
  resultValue?: string;
}
export class UpdateRequestedTestDto {
  @IsOptional()
  @IsEnum(TestStatus)
  status?: TestStatus;
}
