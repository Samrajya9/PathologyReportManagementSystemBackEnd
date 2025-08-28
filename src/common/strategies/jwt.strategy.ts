//src/common/strategies/jwt.strategy.ts
import { AppJwtPayloadBase } from '@modules/auth/auth.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface JwtPayload extends AppJwtPayloadBase {
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  id: string | number;
  email: string;
  role: 'admin' | 'partner' | 'user';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment');
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

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }

  private static extractJWTFromCookie(req: Request): string | null {
    if (req.cookies?.accessToken) {
      return req.cookies.accessToken;
    }
    return null;
  }
}
