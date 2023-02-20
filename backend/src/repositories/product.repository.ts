import { IListDto } from 'src/models/dtos/list.dto';
import { IMdbProduct } from 'src/models/mdb-product';
import { IXlsUpdateProduct } from 'src/models/xls-update-product';

export abstract class ProductRepository {
  upsertMany(entitiesJson: IMdbProduct[]): void {
    throw Error('Not implemented');
  }
  updateFromXlsProducts(xlsProducts: IXlsUpdateProduct[]): void {
    throw Error('Not implemented');
  }
  async findAll(params: {
    page?: string;
    size?: string;
    orderBy?: string;
    orderDirection?: string;
    filter?: string;
  }): Promise<IListDto<any>> {
    throw Error('Not implemented');
  }
}
