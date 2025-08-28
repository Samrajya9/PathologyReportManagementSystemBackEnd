import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDepartmentDto {
  @IsNotEmpty({ message: 'Department name is required' })
  @MaxLength(100, { message: 'Department name must not exceed 100 characters' })
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
