import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTesUnitDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
