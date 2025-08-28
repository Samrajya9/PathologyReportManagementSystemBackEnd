import { IsNotEmpty, IsString } from 'class-validator';

export class CreateContainerDto {
  @IsNotEmpty({ message: 'Container name is required' })
  @IsString()
  name: string;
}
