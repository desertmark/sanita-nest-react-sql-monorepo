import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../../src/models/entities/product.entity';
import { IMdbProduct } from '../../src/models/mdb-product';
import { ProductMapper } from '../../src/utils/product.mapper';
import { Repository } from 'typeorm';
import { ParseManager } from './parse.manager';
import { ChunkUtil } from '../../src/utils/common.utils';
import { CategoryRepository } from '../../src/repositories/category.repository';
import { CategoryMapper } from '../../src/utils/category.mapper';
import { MdbProduct } from '../../src/models/entities/mdb-product.entity';

@Injectable()
export class ProductManager {
  constructor(
    @InjectRepository(ProductEntity)
    private productsRepository: Repository<ProductEntity>,
    @InjectRepository(MdbProduct)
    private mdbProductRepository: Repository<MdbProduct>,
    private categoryRepository: CategoryRepository,
    private parser: ParseManager,
    private logger: Logger,
  ) {}

  async findAll(): Promise<ProductEntity[]> {
    return await this.productsRepository.find();
  }

  async insertMany(products: ProductEntity[]) {
    try {
      this.logger.log('Insert many products...');
      return await this.productsRepository
        .createQueryBuilder()
        .insert()
        .into(ProductEntity)
        .values(products)
        .execute();
    } catch (error) {
      console.log(error);
      this.logger.error('Failed to insert many products', {
        error,
        productsCount: products?.length,
      });
      throw error;
    }
  }

  private async findExistingCodes(): Promise<number[]> {
    const res = await this.productsRepository
      .createQueryBuilder()
      .select('code')
      .execute();
    return res.map((row) => +row.code);
  }

  async upsertFormMdb(file: Express.Multer.File) {
    try {
      this.logger.debug('Parsing mdb file...');
      const mdbProducts = await this.parser.mdbToJson<IMdbProduct[]>(
        file,
        'lista',
      );

      this.logger.debug('Creating categories entities in memory...');
      const categories = CategoryMapper.extractCategories(mdbProducts);
      await this.categoryRepository.upsertMany(categories);
      const dbCategories = await this.categoryRepository.find();

      this.logger.debug('Mapping mdb output to product like json...');
      const jsonEntities = mdbProducts?.map((mdbProduct) =>
        ProductMapper.mdbProductToProductEntity(mdbProduct, dbCategories),
      );

      this.logger.debug('Creating product entities in memory...');
      const entities = this.productsRepository.create(jsonEntities);

      this.logger.debug('Reading existing product codes...');
      const dbCodes = await this.findExistingCodes();

      this.logger.debug('Calculating product insertions and updates...');
      const insertProducts = entities.filter((p) => !dbCodes.includes(p.code));
      const updateProducts = entities.filter((p) => dbCodes.includes(p.code));
      this.logger.debug(
        `To insert: ${insertProducts?.length}, to update: ${updateProducts?.length}`,
      );
      if (insertProducts?.length) {
        this.logger.debug('Inserting product to the database...');
        const insertChunks = new ChunkUtil(insertProducts, 100);
        await insertChunks.doInChunks(async (chunk) => {
          await this.insertMany(chunk);
        });
      }
      if (updateProducts?.length) {
        this.logger.debug('Updating product to the database...');
        const updates = updateProducts.map(async (p) => {
          this.logger.debug(`Updating product code: ${p.code}`);
          await this.productsRepository.update({ code: p.code }, p);
        });
        await Promise.all(updates);
      }

      this.logger.log('mdb upsert complete!');
    } catch (error) {
      this.logger.error('Failed to upsert from mdb file', { error });
      throw error;
    }
  }

  async insertFromMdb(file: Express.Multer.File) {
    this.logger.log(`Insert many Mdb Product...`);
    this.logger.debug('Parsing mdb file...');
    const mdbProducts = await this.parser.mdbToJson<IMdbProduct[]>(
      file,
      'lista',
    );
    const entitiesJson = mdbProducts?.map((p) =>
      ProductMapper.mdbJsonToMdbProductEntity(p),
    );
    const qb = await this.mdbProductRepository.createQueryBuilder();
    this.logger.log('Insert Mdb Products in chunks');
    await new ChunkUtil(entitiesJson, 100).doInChunks(async (chunk, page) => {
      this.logger.debug(`Insert Mdb Product in chunk: ${page}`);
      await qb.insert().into(MdbProduct).values(chunk).execute();
    });

    this.logger.log('Running migration stored procedure...');
    await this.mdbProductRepository.manager.query('exec migrateMdbProducts');

    this.logger.log('Cleaning mdbProducts....');
    qb.delete()
      .from(MdbProduct)
      .execute()
      .then(() => this.logger.log('MdbProducts cleaned!'))
      .catch((error) =>
        this.logger.error('Failed to clean MdbProducts', error),
      );
  }
}
