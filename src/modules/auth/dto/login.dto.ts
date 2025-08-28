import { IsEmail, IsNotEmpty, IsString, IsIn } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsIn(['admin', 'partner', 'user'])
  userType: 'admin' | 'partner' | 'user';
}
