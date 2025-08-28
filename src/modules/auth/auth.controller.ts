import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ResponseMessage } from '@common/decorators/response-message.decorator';
import { CreateAdminDto } from '@modules/admin/dto/create-admin.dto';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';
import { CreatePartnerDto } from '@modules/partner/dto/create-partner.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ResponseMessage('Login successfully')
  login(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto);
  }

  @Post('register/admin')
  @ResponseMessage('Admin registered successfully')
  adminRegister(@Body() createAdminDto: CreateAdminDto) {
    return this.authService.registerAdmin(createAdminDto);
  }

  @Post('register/user')
  @ResponseMessage('User registered successfully')
  userRegister(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  //Partner admin creating a new user
  @Post('register/partner')
  @ResponseMessage('Partner registered successfully')
  partnerRegister(@Body() createPartnerDto: CreatePartnerDto) {}

  //First-time partner signup
  @Post('register/partner-with-company')
  @ResponseMessage('Partner registered successfully')
  partnerWithCompanyRegister(@Body() createPartnerDto: CreatePartnerDto) {}
}
