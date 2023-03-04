import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqlModule } from '../database/sql.module';
import { ConfigModule } from '../config/config.module';
import { CategoryEntity } from '../models/entities/category.entity';
import { ProductEntity } from '../models/entities/product.entity';
import { MdbProduct } from '../models/entities/mdb-product.entity';
import { XlsProduct } from '../models/entities/xls-product.entity';
import { SqlCategoryRepository } from './sql-category.repository';
import { SqlProductRepository } from './sql-product.repository';
import { ProductRepository } from './product.repository';
import { CategoryRepository } from './category.repository';

const providers = [
  { provide: CategoryRepository, useClass: SqlCategoryRepository },
  { provide: ProductRepository, useClass: SqlProductRepository },
];

@Module({
  imports: [
    SqlModule,
    ConfigModule,
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
export class SqlRepositoriesModule {}
