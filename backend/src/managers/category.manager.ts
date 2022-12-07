import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '../models/entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryManager {
  constructor(
    @InjectRepository(CategoryEntity)
    private categorysRepository: Repository<CategoryEntity>,
  ) {}

  findAll(): Promise<CategoryEntity[]> {
    return this.categorysRepository.find();
  }
}
