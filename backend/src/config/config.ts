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
}
export const CONFIG = Symbol('config');
