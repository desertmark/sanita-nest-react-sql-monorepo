import { DynamicModule, Inject, Logger, Module } from '@nestjs/common';
import { ParseManager } from './parse.manager';
import { ProductManager } from './product.manager';
import { SqlRepositoriesModule } from '../repositories/sql-repositories.module';
import { CosmosRepositoriesModule } from '../repositories/cosmos-repositories.module';
import { ConfigModule } from '../config/config.module';

export interface ManagersModuleOptions {
  repository: 'sql' | 'cosmos';
}

const repositoryDict = {
  sql: SqlRepositoriesModule,
  cosmos: CosmosRepositoriesModule,
};

const bannerDict = {
  sql: `
  ╔═╗╔═╗ ╦  
  ╚═╗║═╬╗║  
  ╚═╝╚═╝╚╩═╝
  `,
  cosmos: `
  ╔═╗╔═╗╔═╗╔╦╗╔═╗╔═╗
  ║  ║ ║╚═╗║║║║ ║╚═╗
  ╚═╝╚═╝╚═╝╩ ╩╚═╝╚═╝
  `,
};

const providers = [ProductManager, ParseManager];
@Module({})
export class ManagersModule {
  static register(options: ManagersModuleOptions): DynamicModule {
    const moduleDefinition = {
      imports: [ConfigModule, repositoryDict[options.repository]],
      providers: [...providers, { provide: 'options', useValue: options }],
      exports: providers,
      module: ManagersModule,
    };
    return moduleDefinition;
  }

  constructor(
    @Inject('options') private options: ManagersModuleOptions,
    private logger: Logger,
  ) {}

  onModuleInit() {
    this.logger.log(
      `Initializing with ${this.options.repository.toLocaleUpperCase()} repositories`,
    );
    this.logger.log(bannerDict[this.options.repository]);
  }
}
