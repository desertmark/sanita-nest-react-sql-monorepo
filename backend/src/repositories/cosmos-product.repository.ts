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
    await new ChunkUtil<IMdbProduct>(entitiesJson, 100, 100).doInChunks(
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
        if (results.some((r) => r.statusCode > 399)) {
          this.logger.error('Failed to process chunk');
          this.logger.error({
            success: results.filter((r) => r.statusCode < 400)?.length,
            failed: results.filter((r) => r.statusCode > 399)?.length,
            results,
          });
          throw new Error(
            `Failed to process page ${page}, chunk ${chunk[0].codigo} - ${
              chunk[chunk.length - 1].codigo
            }`,
          );
        }
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

  /**
   * Takes xlsProduct model and performs bulk update
   * @param xlsProducts
   */
  public async updateFromXlsProducts(xlsProducts: IXlsUpdateProduct[]) {
    this.logger.debug('Update many xls products in chunks....');
    await new ChunkUtil<IXlsUpdateProduct>(xlsProducts, 100, 100).doInChunks(
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
   * Patches price bonus and bonus2 fields of a product document.
   */
  private async updateFromXlsProductById(
    id: string,
    xlsProduct: IXlsUpdateProduct,
  ) {
    try {
      await this.cosmosService.products.container
        .item(id, CosmosContainers.Products)
        .patch({
          operations: [
            { op: 'set', path: '/listPrice', value: xlsProduct.precio },
            { op: 'set', path: '/bonus', value: xlsProduct.bonificacion },
            { op: 'set', path: '/bonus2', value: xlsProduct.bonificacion2 },
          ],
        });
    } catch (error) {
      if (error?.code === 404) {
        this.logger.warn(
          `Product ${xlsProduct.codigoString} not found, ignoring update`,
        );
      } else {
        throw error;
      }
    }
  }
}
