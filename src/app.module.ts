import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseConfig } from './global/config';
import { DataSourceOptions } from 'typeorm';
import { TestModule } from './test/test.module';
import { TestModule } from './type/test/test/test.module';
import { TestModule } from './type/test/test.module';
import { TestModule } from './test-type/test/test.module';
import { TestModule } from './type/test/test.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
