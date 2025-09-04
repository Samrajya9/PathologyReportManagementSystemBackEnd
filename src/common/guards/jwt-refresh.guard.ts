import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGaurd extends AuthGuard('refresh') {
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw (
        err || new UnauthorizedException('Invalid or expired refresh token')
      );
    }
    return user;
  }
}
