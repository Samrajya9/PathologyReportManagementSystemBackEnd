import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMedicalDepartmentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  description: string;
}
