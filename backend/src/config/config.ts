import { resolve } from 'path';
import { config as dotenv } from 'dotenv';
const rootPath = resolve(__dirname, '..', '..');
const envPath = resolve(rootPath, '.env');
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
} = process.env;

export const config = {
  rootPath,
  server: {
    host: HOST,
    port: PORT,
  },
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

export interface IConfig {
  rootPath: string;
  server: {
    host: string;
    port: string;
  };
  db: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    generateSchema: boolean;
    generateSchemaForce: boolean;
  };
  cosmos: {
    endpoint: string;
    primaryKey: string;
    database: string;
  };
  parseServiceUrl: string;
}
export const CONFIG = Symbol('config');
