import { CategoryEntity } from '../models/entities/category.entity';

export abstract class CategoryRepository {
  async find(): Promise<CategoryEntity[]> {
    throw Error('Not Implemented');
  }
  async insertMany(categories: CategoryEntity[]): Promise<void> {
    throw Error('Not Implemented');
  }
  async upsertMany(categories: CategoryEntity[]): Promise<void> {
    throw Error('Not Implemented');
  }
}
