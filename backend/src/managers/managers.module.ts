import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../../src/config/config.module';
import { DatbaseModule } from '../../src/database/database.module';
import { CategoryEntity } from '../../src/models/entities/category.entity';
import { MdbProduct } from '../../src/models/entities/mdb-product.entity';
import { ProductEntity } from '../../src/models/entities/product.entity';
import { RepositoriesModule } from '../../src/repositories/repositories.module';
import { CategoryManager } from './category.manager';
import { ParseManager } from './parse.manager';
import { ProductManager } from './product.manager';

const providers = [ProductManager, CategoryManager, ParseManager];

@Module({
  imports: [
    ConfigModule,
    DatbaseModule,
    RepositoriesModule,
    TypeOrmModule.forFeature([ProductEntity, CategoryEntity, MdbProduct]),
  ],
  providers,
  exports: providers,
})
export class ManagersModule {}
