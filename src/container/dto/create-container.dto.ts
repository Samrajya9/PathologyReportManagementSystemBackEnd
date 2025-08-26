import { IsNotEmpty } from 'class-validator';

export class CreateContainerDto {
  @IsNotEmpty()
  name: string;
}
