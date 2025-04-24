import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions';
import configuration from './configuration';

export const DATA_SOURCE_OPTIONS: SqlServerConnectionOptions = {
  type: 'mssql',
  ...configuration().database,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migration/*{.ts,.js}'],
};
