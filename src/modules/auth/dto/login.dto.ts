import { IsEmail, IsNotEmpty, IsString, IsIn } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsIn(['admin', 'partner', 'user'])
  role: 'admin' | 'partner' | 'user'; // "role" is more semantic than "userType"
}
