import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePanelDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumberString()
  price: string;

  @IsNumber()
  @IsNotEmpty()
  turnaround_time_hours: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_active: boolean;

  @IsOptional()
  @IsString()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  medicalDepartmentId: number;

  @IsNumber({}, { each: true })
  @IsNotEmpty()
  @Type(() => Number)
  testId: number[];
}
