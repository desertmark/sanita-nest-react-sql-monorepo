import { join } from 'path';
import { ConfigService } from '../config/config.service';
import { DataSource } from 'typeorm';
const config = new ConfigService().config;

console.log('__MIGRATIONS__', config);

export const dataSource: DataSource = new DataSource({
  type: 'mssql',
  database: config.db.database,
  authentication: {
    type: 'default',
    options: {
      userName: config.db.user,
      password: config.db.password,
    },
  },
  host: config.db.host,
  port: +config.db.port,
  migrations: [join(config.rootPath, 'migrations', '*')],
  extra: {
    validateConnection: false,
    trustServerCertificate: true,
  },
});
