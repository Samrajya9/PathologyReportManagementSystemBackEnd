import { PartialType } from '@nestjs/mapped-types';
import { CreateDepartmentDto } from './create-medical_department.dto';

export class UpdateMedicalDepartmentDto extends PartialType(
  CreateDepartmentDto,
) {}
