import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { CosmosModule } from '../database/cosmos.module';
import { CosmosProductRepository } from './cosmos-product.repository';
import { ProductRepository } from './product.repository';
const providers = [
  { provide: ProductRepository, useClass: CosmosProductRepository },
];

@Module({
  imports: [ConfigModule, CosmosModule],
  providers,
  exports: providers,
})
export class CosmosRepositoriesModule {}
