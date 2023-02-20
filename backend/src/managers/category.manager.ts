import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '../models/entities/category.entity';
import { Repository } from 'typeorm';
import { CategoryRepository } from 'src/repositories/category.repository';

@Injectable()
export class CategoryManager {
  constructor(private categorysRepository: CategoryRepository) {}

  findAll(): Promise<CategoryEntity[]> {
    return this.categorysRepository.find();
  }
}
