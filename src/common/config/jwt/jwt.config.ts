//src/common/config/jwt/jwt.config.ts
import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default registerAs('jwtConfig', (): JwtModuleOptions => {
  return {
    secret: process.env.JWT_SECRET || 'defaultSecret',
    signOptions: {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
  };
});
