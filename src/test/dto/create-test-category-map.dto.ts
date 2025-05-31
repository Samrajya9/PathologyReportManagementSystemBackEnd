import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTestCategoryMapDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  testId: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  categoryId: number;
}
