//src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CookieConfig, DatabaseConfig, JwtConfig } from './common/config';
import { DataSourceOptions } from 'typeorm';
import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { MedicalDepartmentsModule } from './modules/medical_departments/medical_departments.module';
import { AppRoutes } from './routes';
import { TestModule } from '@modules/test/test.module';
import { PanelsModule } from '@modules/panels/panels.module';
import { SpecimensModule } from '@modules/specimens/specimens.module';
import { ContainerModule } from '@modules/container/container.module';
import { AppExceptionFilters } from './common/filters/app-exception.filter';
import { AppInterceptors } from './common/interceptors/app.interceptor';
import { PartnerModule } from './modules/partner/partner.module';
import { PartnerCompanyModule } from './modules/partner-company/partner-company.module';
import { UserModule } from './modules/user/user.module';
import { AdminModule } from '@modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { TestRequestsModule } from './modules/test-requests/test-requests.module';
import { PatientModule } from './modules/patient/patient.module';

@Module({
  imports: [
    RouterModule.register(AppRoutes),

    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [DatabaseConfig, JwtConfig, CookieConfig],
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const config = configService.get<DataSourceOptions>('databaseConfig');
        if (!config) {
          throw new Error('Database config not found');
        }
        return config;
      },
    }),

    CacheModule.registerAsync({
      useFactory: async () => {
        return {
          stores: [createKeyv('redis://localhost:6379/0')],
          ttl: 60 * 1000,
        };
      },
    }),

    AdminModule,
    TestModule,
    MedicalDepartmentsModule,
    PanelsModule,
    SpecimensModule,
    ContainerModule,
    PartnerModule,
    PartnerCompanyModule,
    UserModule,
    AuthModule,
    TestRequestsModule,
    PatientModule,
  ],

  controllers: [AppController],
  providers: [
    {
      provide: 'APP_FILTER',
      useClass: AppExceptionFilters,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AppInterceptors,
    },
    AppService,

    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor,
    // },
  ],
})
export class AppModule {}
