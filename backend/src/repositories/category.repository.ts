import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '../models/entities/category.entity';
import { ChunkUtil } from '../utils/common.utils';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryRepository extends Repository<CategoryEntity> {
  constructor(
    @InjectRepository(CategoryEntity)
    repository: Repository<CategoryEntity>,
    private logger: Logger,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
  public async insertMany(categories: CategoryEntity[]) {
    return this.createQueryBuilder()
      .insert()
      .into(CategoryEntity)
      .values(categories)
      .execute();
  }

  public async upsertMany(categories: CategoryEntity[]) {
    this.logger.debug('Reading existing categories...');
    const dbDescriptions = (await this.find())?.map((c) => c.description);

    this.logger.debug('Calculating categories to insert...');
    const insertCategories = categories?.filter(
      (c) => !dbDescriptions.includes(c.description),
    );
    if (insertCategories?.length) {
      this.logger.log(
        `Insert ${insertCategories?.length} categories in the database...`,
      );
      const chunks = new ChunkUtil(insertCategories, 100);
      await chunks.doInChunks(async (categories, page) => {
        this.logger.debug(`Intert categories in the database ${page}`);
        await this.insertMany(categories);
      });
    } else {
      this.logger.log('Did not found any new category to insert, skipping....');
    }
  }
}
