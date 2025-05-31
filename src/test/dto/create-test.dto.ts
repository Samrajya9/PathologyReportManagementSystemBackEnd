import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateTestDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  testUnitId: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  testTypeId: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ValidateNested({ each: true })
  categoryIds: number[];

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  normalRangeMin: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  normalRangeMax: number;
}
