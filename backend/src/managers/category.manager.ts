import { Injectable } from '@nestjs/common';
import { CategoryEntity } from '../models/entities/category.entity';
import { CategoryRepository } from '../repositories/category.repository';

@Injectable()
export class CategoryManager {
  constructor(private categorysRepository: CategoryRepository) {}

  findAll(): Promise<CategoryEntity[]> {
    return this.categorysRepository.find();
  }
}
