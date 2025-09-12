import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Request } from 'express';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, email: string, password: string) {
    const role = req.body.role;
    const loginDto: LoginDto = {
      email,
      password,
      role,
    };

    const user = await this.authService.validateUser(loginDto);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
