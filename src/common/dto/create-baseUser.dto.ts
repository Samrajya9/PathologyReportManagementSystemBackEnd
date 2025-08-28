import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateBaseUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
