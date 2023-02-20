import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { XlsProduct } from '../models/entities/xls-product.entity';
import { ConfigModule } from '../config/config.module';
import { CategoryEntity } from '../models/entities/category.entity';
import { MdbProduct } from '../models/entities/mdb-product.entity';
import { ProductEntity } from '../models/entities/product.entity';
import { CategoryManager } from './category.manager';
import { ParseManager } from './parse.manager';
import { ProductManager } from './product.manager';
import { SqlRepositoriesModule } from '../repositories/sql-repositories.module';

const providers = [ProductManager, CategoryManager, ParseManager];

@Module({
  imports: [
    ConfigModule,
    SqlRepositoriesModule,
    TypeOrmModule.forFeature([
      ProductEntity,
      CategoryEntity,
      MdbProduct,
      XlsProduct,
    ]),
  ],
  providers,
  exports: providers,
})
export class ManagersModule {}
