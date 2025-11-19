//src/common/guards/jwt-auth.guard.ts
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
  handleRequest<AppAuthenticatedUser>(
    err: any,
    user: AppAuthenticatedUser,
    info: any,
  ) {
    // If JWT validation error occurs
    if (err || !user) {
      // if (info instanceof TokenExpiredError) {
      //   // JWT is expired
      //   throw new UnauthorizedException('access_token expired');
      // }
      // Any other invalid token error
      throw new UnauthorizedException('Invalid access_token.');
    }
    // If JWT is valid
    return user;
  }
}
