//src/common/strategies/jwt.strategy.ts
import { AppAuthenticatedUser } from '@common/types/express';
import { AppJwtPayload } from '@common/types/jwt.types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    const secret = configService.get<string>('jwtConfig.access.secret');
    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET is not defined in environment');
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookie,
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
    if (req.cookies?.accessToken) {
      return req.cookies.accessToken;
    }
    return null;
  }
}
