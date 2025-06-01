import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTestTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
