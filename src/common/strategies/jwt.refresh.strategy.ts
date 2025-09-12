import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AppJwtPayload } from '@common/types/jwt.types';
import { AppAuthenticatedUser } from '@common/types/express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private readonly configService: ConfigService) {
    const secret = configService.get<string>('jwtConfig.refresh.secret');
    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET is not defined in environment');
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtRefreshStrategy.extractJWTFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: AppJwtPayload): Promise<AppAuthenticatedUser> {
    const { id, email, role } = payload;
    return {
      id,
      email,
      role,
    };
  }
  private static extractJWTFromCookie(req: Request): string | null {
    if (req.cookies?.refreshToken) {
      return req.cookies.refreshToken;
    }
    return null;
  }
}
