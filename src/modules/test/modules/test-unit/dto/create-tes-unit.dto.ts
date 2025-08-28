import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTesUnitDto {
  @IsNotEmpty({ message: 'Test unit name is required' })
  @IsString()
  name: string;
}
