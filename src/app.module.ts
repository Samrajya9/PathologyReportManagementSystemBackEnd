import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseConfig } from './global/config';
import { DataSourceOptions } from 'typeorm';
import { TestModule } from './test/test.module';
import { RouterModule } from '@nestjs/core';
import { TestUnitModule } from './test/modules/test-unit/test-unit.module';
import { TestTypeModule } from './test/modules/test-type/test-type.module';
import { TestCategoryModule } from './test/modules/test-category/test-category.module';
import { TestFallbackModule } from './test/modules/test-fallback/test-fallback.module';

@Module({
  imports: [
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
    TestModule,
    RouterModule.register([
      {
        path: 'tests',
        children: [
          { path: '/', module: TestModule },
          { path: 'units', module: TestUnitModule },
          { path: 'types', module: TestTypeModule },
          { path: 'categories', module: TestCategoryModule },
          { path: '/', module: TestFallbackModule },
        ],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
