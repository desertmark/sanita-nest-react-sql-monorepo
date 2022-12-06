import { uniq } from 'lodash';
import { CategoryEntity } from '../../src/models/entities/category.entity';
import { IMdbProduct } from '../../src/models/mdb-product';
import { CommonUtils } from './common.utils';

export class CategoryMapper {
  static extractCategories(products: IMdbProduct[]): CategoryEntity[] {
    const categories = uniq(
      products.map((p) => CommonUtils.cleanDescription(p.rubro)),
    );
    return categories.map((c) => ({
      description: c,
    }));
  }
}
