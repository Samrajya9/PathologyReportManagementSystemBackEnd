//src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminModule } from '@modules/admin/admin.module';
import { PartnerModule } from '@modules/partner/partner.module';
import { UserModule } from '@modules/user/user.module';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    AdminModule,
    PartnerModule,
    UserModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const config = configService.get<JwtModuleOptions>('jwtConfig');
        if (!config) {
          throw new Error('Jwt config not found');
        }
        return config;
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
