import {
  BadRequestException,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductManager } from '../managers/product.manager';
import { ProductEntity } from '../models/entities/product.entity';

@Controller('products')
export class ProductController {
  constructor(private productsManager: ProductManager) {}

  @Get()
  async get(): Promise<ProductEntity[]> {
    return this.productsManager.findAll();
  }

  @Post('mdb')
  @UseInterceptors(FileInterceptor('file'))
  async mdb(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('file field is empty.');
    }
    return await this.productsManager.upsertFromMdb(file);
  }

  @Post('xls')
  @UseInterceptors(FileInterceptor('file'))
  async xls(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('file field is empty.');
    }
    return await this.productsManager.updateFromXls(file);
  }
}
