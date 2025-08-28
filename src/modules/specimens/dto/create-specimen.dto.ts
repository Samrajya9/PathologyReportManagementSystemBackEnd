import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSpecimenDto {
  @IsNotEmpty({ message: 'Specimen name is required' })
  @IsString()
  name: string;
}
