import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicalDepartmentDto } from './create-medical_department.dto';

export class UpdateMedicalDepartmentDto extends PartialType(CreateMedicalDepartmentDto) {}
