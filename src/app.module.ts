import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseConfig } from './global/config';
import { DataSourceOptions } from 'typeorm';
import { TestModule } from './test/test.module';
import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { AppInterceptors } from './global/Interceptors';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { MedicalDepartmentsModule } from './medical_departments/medical_departments.module';
import { AppRoutes } from './global/routes/routes';
import { PanelsModule } from './panels/panels.module';
import { SpecimensModule } from './specimens/specimens.module';
import { ApplicationExceptionFilters } from './global/ExceptionFilters';

@Module({
  imports: [
    RouterModule.register(AppRoutes),
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [DatabaseConfig],
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
    TestModule,
    MedicalDepartmentsModule,
    PanelsModule,
    SpecimensModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: 'APP_FILTER',
      useClass: ApplicationExceptionFilters,
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
