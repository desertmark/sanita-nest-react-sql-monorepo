import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { XlsProduct } from '../models/entities/xls-product.entity';
import { ConfigModule } from '../config/config.module';
import { DatbaseModule } from '../database/database.module';
import { CategoryEntity } from '../models/entities/category.entity';
import { MdbProduct } from '../models/entities/mdb-product.entity';
import { ProductEntity } from '../models/entities/product.entity';
import { RepositoriesModule } from '../repositories/repositories.module';
import { CategoryManager } from './category.manager';
import { ParseManager } from './parse.manager';
import { ProductManager } from './product.manager';

const providers = [ProductManager, CategoryManager, ParseManager];

@Module({
  imports: [
    ConfigModule,
    DatbaseModule,
    RepositoriesModule,
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
