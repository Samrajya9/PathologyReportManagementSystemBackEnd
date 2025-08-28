import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ResponseMessage } from '@common/decorators/response-message.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ResponseMessage('Login successfully')
  login(@Body() loginDto: LoginDto) {
    return this.authService.validateUser(loginDto);
  }
}
