import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTestUnitDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
