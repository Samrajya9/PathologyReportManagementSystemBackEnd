// src\global\config\database\dataSource.ts
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { config } from 'dotenv';
import { DatabaseConfig } from '..';
config();

export class DataSourceConfig {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  getDataSourceOptions(): DataSourceOptions {
    const options = DatabaseConfig();
    return {
      ...options,
      migrations: ['database/migrations/*{.ts,.js}'],
    };
  }
}

const configService = new ConfigService({ load: [DatabaseConfig] });
const dataSourceConfig = new DataSourceConfig(configService);
const options = dataSourceConfig.getDataSourceOptions();
console.log(options);
const dataSource = new DataSource(options);

export default dataSource;
