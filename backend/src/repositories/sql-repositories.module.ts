import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqlModule } from '../database/sql.module';
import { ConfigModule } from '../config/config.module';
import { CategoryEntity } from '../models/entities/category.entity';
import { ProductEntity } from '../models/entities/product.entity';
import { CategoryRepository } from './category.repository';

const providers = [CategoryRepository];

@Module({
  imports: [
    SqlModule,
    ConfigModule,
    TypeOrmModule.forFeature([ProductEntity, CategoryEntity]),
  ],
  providers,
  exports: providers,
})
export class SqlRepositoriesModule {}
