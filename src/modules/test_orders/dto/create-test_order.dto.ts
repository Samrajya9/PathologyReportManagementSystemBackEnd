import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class CreateTestOrderDto {
  // ✔ testIds must be an array
  // ✔ Array must not be empty
  // ✔ Every item must be a valid integer
  // ✔ Incoming values like "1" are converted to numbers
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Type(() => Number)
  testIds: number[];
}
