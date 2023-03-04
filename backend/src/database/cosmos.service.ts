import { CosmosClient, FeedOptions, SqlQuerySpec } from '@azure/cosmos';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
export enum CosmosContainers {
  Products = 'products',
}

@Injectable()
export class CosmosService {
  public client: CosmosClient;
  private dbName: string;
  constructor(private configService: ConfigService, private logger: Logger) {
    this.client = new CosmosClient({
      endpoint: this.configService.config.cosmos.endpoint,
      key: this.configService.config.cosmos.primaryKey,
    });
    this.dbName = this.configService.config.cosmos.database;
    console.log(this.dbName);
  }

  async createDb() {
    try {
      this.logger.log(`Attempt to create cosmos ${this.dbName} database...`);
      await this.client.databases.createIfNotExists({
        id: this.dbName,
      });
      this.logger.log(
        `Attempt to create cosmos ${CosmosContainers.Products} container...`,
      );
      await this.client.database(this.dbName).containers.createIfNotExists({
        id: CosmosContainers.Products,
        partitionKey: '/pk',
      });
      this.logger.log(`Cosmos Database succesfully created.`);
    } catch (error) {
      this.logger.error('Failed to create cosmos database schema: ', { error });
      throw error;
    }
  }

  get database() {
    return this.client.database(this.dbName);
  }

  get products() {
    return this.database.container(CosmosContainers.Products).items;
  }

  async query<T>(
    containerId: string,
    querySpec: SqlQuerySpec,
    options?: FeedOptions,
  ) {
    return this.database
      .container(containerId)
      .items.query<T>(querySpec, options)
      ?.fetchAll();
  }
}
