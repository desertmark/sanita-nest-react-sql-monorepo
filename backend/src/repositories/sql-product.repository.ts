import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../models/entities/product.entity';
import { IMdbProduct } from '../models/mdb-product';
import { EntityPropertyNotFoundError, Like, Repository } from 'typeorm';
import { ChunkUtil } from '../utils/common.utils';
import { MdbProduct } from '../models/entities/mdb-product.entity';
import { XlsProduct } from '../models/entities/xls-product.entity';
import { IListDto } from '../models/dtos/list.dto';
import { IXlsUpdateProduct } from '../models/xls-update-product';
import { ProductMapper } from '../utils/product.mapper';

@Injectable()
export class SqlProductRepository extends Repository<ProductEntity> {
  constructor(
    @InjectRepository(ProductEntity)
    private productsRepository: Repository<ProductEntity>,
    @InjectRepository(MdbProduct)
    private mdbProductRepository: Repository<MdbProduct>,
    @InjectRepository(XlsProduct)
    private xlsProductRepository: Repository<XlsProduct>,
    private logger: Logger,
  ) {
    super(
      productsRepository.target,
      productsRepository.manager,
      productsRepository.queryRunner,
    );
  }

  async findAll(params): Promise<IListDto<ProductEntity>> {
    try {
      const {
        page = 0,
        size = 100,
        orderBy = 'id',
        orderDirection = 'asc',
        filter = '',
      } = params;
      this.logger.log('Find all products', { params });
      const [items, total] = await this.productsRepository.findAndCount({
        take: size,
        skip: page * size,
        order: {
          [orderBy]: orderDirection,
        },
        where: [
          { codeString: Like(`${filter}%`) },
          { description: Like(`%${filter}%`) },
        ],
      });
      return {
        items,
        total,
        page,
        size,
      };
    } catch (error) {
      this.logger.error('Failed to find all products', error, { params });
      if (error instanceof EntityPropertyNotFoundError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  async upsertMany(mdbProducts: IMdbProduct[]) {
    const mdbEntities = mdbProducts.map((p) =>
      ProductMapper.mdbJsonToMdbProductEntity(p),
    );
    const qb = await this.mdbProductRepository.createQueryBuilder();
    this.logger.log('Insert Mdb Products in chunks');
    await new ChunkUtil<IMdbProduct>(mdbEntities, 100).doInChunks(
      async (chunk, page) => {
        this.logger.debug(`Insert Mdb Product in chunk: ${page}`);
        await qb.insert().into(MdbProduct).values(chunk).execute();
      },
    );

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

  public async updateFromXlsProducts(xlsProducts: IXlsUpdateProduct[]) {
    this.logger.debug('Insert many xls products in chunks....');
    await new ChunkUtil<IXlsUpdateProduct>(xlsProducts, 100).doInChunks(
      async (chunk, page) => {
        this.logger.debug(`Insert many xls products in chunks: ${page}`);
        await this.xlsProductRepository
          .createQueryBuilder()
          .insert()
          .into(XlsProduct)
          .values(chunk)
          .execute();
      },
    );

    this.logger.debug('Running update migration...');
    await this.xlsProductRepository.manager.query(`
      UPDATE Products
        SET listPrice = xp.precio,
          bonus = xp.bonificacion,
          bonus2 = xp.bonificacion2
      FROM Products p 
        INNER JOIN XlsProducts xp ON xp.codigo = p.code
    `);
    this.logger.log('Cleaning XlsProducts....');
    this.xlsProductRepository
      .createQueryBuilder()
      .delete()
      .from(XlsProduct)
      .execute()
      .then(() => this.logger.log('XlsProducts cleaned!'))
      .catch((error) =>
        this.logger.error('Failed to clean XlsProducts', error),
      );
  }
}
