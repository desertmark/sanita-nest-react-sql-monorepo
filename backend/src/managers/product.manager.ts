import { Injectable, Logger } from '@nestjs/common';
import { ProductEntity } from '../models/entities/product.entity';
import { IMdbProduct } from '../models/mdb-product';
import { ProductMapper } from '../utils/product.mapper';
import { ParseManager } from './parse.manager';
import { IListDto } from '../models/dtos/list.dto';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class ProductManager {
  constructor(
    private productsRepository: ProductRepository,
    private parser: ParseManager,
    private logger: Logger,
  ) {}

  async findAll(params): Promise<IListDto<ProductEntity>> {
    return await this.productsRepository.findAll(params);
  }

  async upsertFromMdb(file: Express.Multer.File) {
    this.logger.log(`Insert many Mdb Product...`);
    this.logger.debug('Parsing mdb file...');
    const mdbProducts = await this.parser.mdbToJson<IMdbProduct[]>(
      file,
      'lista',
    );
    await this.productsRepository.upsertMany(mdbProducts);
  }

  public async updateFromXls(file: Express.Multer.File) {
    this.logger.log('Update products from xls file...');
    this.logger.debug('Parsing xls file...');
    const json = await this.parser.xlsToJson<Record<string, string>[]>(file, 2);

    this.logger.debug('Mapping to xlsProducts....');
    const xlsProducts = json.map((p) =>
      ProductMapper.xlsJsonToXlsProductEntityt(p),
    );
    await this.productsRepository.updateFromXlsProducts(xlsProducts);
  }
}
