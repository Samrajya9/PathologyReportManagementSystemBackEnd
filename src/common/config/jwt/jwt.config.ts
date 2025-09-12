//src/common/config/jwt/jwt.config.ts
import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default registerAs('jwtConfig', () => ({
  access: <JwtModuleOptions>{
    secret: process.env.JWT_ACCESS_SECRET || 'accessSecret',
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  },
  refresh: <JwtModuleOptions>{
    secret: process.env.JWT_REFRESH_SECRET || 'refreshSecret',
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
}));
