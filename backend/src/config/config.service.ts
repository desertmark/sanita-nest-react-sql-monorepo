import { resolve } from 'path';
import { config as dotenv } from 'dotenv';
import { IConfig } from './config.model';

const rootPath = resolve('.');
const envPath = resolve(rootPath, '.env');

console.log({ envPath });
dotenv({ path: envPath });

const {
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USER,
  DB_PASSWORD,
  DB_GENERATE_SCHEMA,
  DB_GENERATE_SCHEMA_FORCE,
  PORT,
  HOST,
  PARSE_SERVICE_URL,
  COSMOS_ENDPOINT,
  COSMOS_DATABASE,
  COSMOS_PRIMARY_KEY,
  REPOSITORY,
} = process.env;

export class ConfigService {
  private _config: IConfig;
  constructor() {
    this.init();
  }

  get config(): IConfig {
    return this._config;
  }

  private init() {
    this._config = {
      rootPath,
      server: {
        host: HOST,
        port: PORT,
      },
      repository: (REPOSITORY as 'sql' | 'cosmos') || 'sql',
      db: {
        host: DB_HOST,
        port: +(DB_PORT || ''),
        database: DB_DATABASE,
        user: DB_USER,
        password: DB_PASSWORD,
        generateSchema: DB_GENERATE_SCHEMA == 'true',
        generateSchemaForce: DB_GENERATE_SCHEMA_FORCE == 'true',
      },
      cosmos: {
        database: COSMOS_DATABASE,
        endpoint: COSMOS_ENDPOINT,
        primaryKey: COSMOS_PRIMARY_KEY,
      },
      parseServiceUrl: PARSE_SERVICE_URL,
    };
  }
}
