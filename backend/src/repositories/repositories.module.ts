import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { CategoryEntity } from '../models/entities/category.entity';
import { ProductEntity } from '../models/entities/product.entity';
import { CategoryRepository } from './category.repository';

const providers = [CategoryRepository];

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([ProductEntity, CategoryEntity]),
  ],
  providers,
  exports: providers,
})
export class RepositoriesModule {}
