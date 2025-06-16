import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSpecimenDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
