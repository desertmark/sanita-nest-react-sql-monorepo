import { Injectable, Logger } from '@nestjs/common';
import { ProductEntity } from '../models/entities/product.entity';
import { IMdbProduct } from '../models/mdb-product';
import { ChunkUtil } from '../utils/common.utils';
import { IListDto } from '../models/dtos/list.dto';
import { IXlsUpdateProduct } from '../models/xls-update-product';
import { CosmosContainers, CosmosService } from '../database/cosmos.service';
import { UpsertOperationInput } from '@azure/cosmos';
import { ProductMapper } from '../utils/product.mapper';
import { ProductRepository } from './product.repository';
import { productFactory } from 'test/cosmos-products.e2e-spec';

const QUERIES = {
  SELECT_PRODUCTS_PAGINATED: `
    SELECT * FROM c
    WHERE c.codeString LIKE @codeString
        OR c.description LIKE @description
    ORDER BY c.code @orderDirection
    OFFSET @offset LIMIT @limit
  `,
  SELECT_COUNT: `SELECT VALUE COUNT(c.id) FROM c`,
  SELEC_ELEMENT_ID_BY_CODE: `SELECT c.id FROM c WHERE c.code = @code`,
};
/**
 * Cleans params of spaces to make sure input is not sql injected.
 */
const clean = (param: string) => param.replace(/\s/g, '');

@Injectable()
export class CosmosProductRepository extends ProductRepository {
  constructor(private logger: Logger, private cosmosService: CosmosService) {
    super();
  }

  async findAll(params): Promise<IListDto<ProductEntity>> {
    try {
      const {
        page = 0,
        size = 100,
        orderBy = 'code',
        orderDirection = 'asc',
        filter = '',
      } = params;
      this.logger.log('Find all products', { params });

      const { resources: items } = await this.cosmosService.products
        .query({
          query: `        
            SELECT * FROM c
            WHERE c.codeString LIKE @codeString
                OR c.description LIKE @description
            ORDER BY c.${clean(orderBy)} ${clean(orderDirection)}
            OFFSET @offset LIMIT @limit
          `,
          parameters: [
            { name: '@codeString', value: `${filter}%` },
            { name: '@description', value: `%${filter}%` },
            { name: '@limit', value: size },
            { name: '@offset', value: page * size },
            { name: '@orderBy', value: `c.${orderBy}` },
            { name: '@orderDirection', value: orderDirection },
          ],
        })
        .fetchAll();

      const {
        resources: [total],
      } = await this.cosmosService.products
        .query<number>(QUERIES.SELECT_COUNT)
        .fetchAll();
      return {
        items,
        total,
        page,
        size,
      };
    } catch (error) {
      this.logger.error('Failed to find all products', error, { params });
      throw error;
    }
  }

  async upsertMany(entitiesJson: IMdbProduct[]) {
    this.logger.log('Upsert Mdb Products in chunks');
    await new ChunkUtil<IMdbProduct>(entitiesJson, 100).doInChunks(
      async (chunk, page) => {
        this.logger.debug(`Upsert Mdb Product in chunk: ${page}`);
        const operations: UpsertOperationInput[] = chunk.map((item) => {
          const product = this.mdbProductToCosmosProduct(item);
          return {
            operationType: 'Upsert',
            partitionKey: CosmosContainers.Products,
            resourceBody: product,
          };
        });
        const results = await this.cosmosService.products.bulk(operations);
        this.logger.debug('Finished');
      },
    );
  }

  private mdbProductToCosmosProduct(mdbProduct: IMdbProduct) {
    const product = ProductMapper.mdbProductToProductEntity(
      mdbProduct,
      [],
    ) as any;

    return {
      ...product,
      id: product.codeString,
      pk: CosmosContainers.Products,
    };
  }

  // async upsertMany(entitiesJson: IMdbProduct[]) {
  //   this.logger.log('Insert Mdb Products in chunks');
  //   const entities = entitiesJson.map((p) =>
  //     ProductMapper.mdbProductToProductEntity(p, []),
  //   );
  //   await new ChunkUtil<ProductEntity>(entities, 100).doInChunks(
  //     async (chunk, page) => {
  //       this.logger.debug(`Upsert Mdb Product in chunk: ${page}`);
  //       const chunkUpserts = chunk.map((product) =>
  //         this.cosmosService.products.upsert({
  //           ...product,
  //           id: product.codeString,
  //           pk: CosmosContainers.Products,
  //         }),
  //       );
  //       await Promise.all(chunkUpserts);
  //     },
  //   );
  //   this.logger.debug(`Upsert Mdb Product done.`);
  // }

  /**
   * Takes xlsProduct model and performs bulk update
   * @param xlsProducts
   */
  public async updateFromXlsProducts(xlsProducts: IXlsUpdateProduct[]) {
    this.logger.debug('Update many xls products in chunks....');
    await new ChunkUtil<IXlsUpdateProduct>(xlsProducts, 30).doInChunks(
      async (chunk, page) => {
        this.logger.debug(`Update Xls Product in chunk: ${page}`);
        const updates = chunk.map(async (xlsProduct) => {
          try {
            await this.findAndUpdateXlsProduct(xlsProduct);
          } catch (error) {
            this.logger.error('Failed to update by xls products', {
              error,
              xlsProduct,
            });
            throw error;
          }
        });
        await Promise.all(updates);
      },
    );
  }

  /**
   * finds a products id and patches the fields price bonus and bonus2 if it founds it.
   * if not skips.
   */
  private async findAndUpdateXlsProduct(xlsProduct: IXlsUpdateProduct) {
    const id = xlsProduct.codigoString;
    this.logger.debug(`xls product found with id: ${id}, updating...`);
    return await this.updateFromXlsProductById(id, xlsProduct);
  }

  /**
   * Finds the product id by the products code.
   */
  private async findProductIdByCode(code: number): Promise<string> {
    const { resources } = await this.cosmosService.products
      .query<{ id: string }>({
        query: QUERIES.SELEC_ELEMENT_ID_BY_CODE,
        parameters: [{ name: 'code', value: code }],
      })
      .fetchAll();
    return resources?.[0].id;
  }

  /**
   * Patches price bonus and bonus2 fields of a product document.
   */
  private async updateFromXlsProductById(
    id: string,
    xlsProduct: IXlsUpdateProduct,
  ) {
    return await this.cosmosService.products.container
      .item(id, CosmosContainers.Products)
      .patch({
        operations: [
          { op: 'set', path: '/listPrice', value: xlsProduct.precio },
          { op: 'set', path: '/bonus', value: xlsProduct.bonificacion },
          { op: 'set', path: '/bonus2', value: xlsProduct.bonificacion2 },
        ],
      });
  }
}
