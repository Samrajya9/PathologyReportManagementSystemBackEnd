// /src/cmmnoo / config / cookie / cookie.config.ts;
import { registerAs } from '@nestjs/config';
import { CookieOptions } from 'express';

export default registerAs(
  'cookieConfig',
  (): { accessToken: CookieOptions; refreshToken: CookieOptions } => {
    return {
      accessToken: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // only secure in production
        sameSite: 'strict' as const,
        maxAge: 15 * 60 * 1000, // 15 minutes
      },
      refreshToken: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      },
    };
  },
);
