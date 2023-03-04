export interface IConfig {
  rootPath: string;
  server: {
    host: string;
    port: string;
  };
  repository: 'sql' | 'cosmos';
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
