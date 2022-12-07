import {
  BadRequestException,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IListDto } from 'src/models/dtos/list.dto';
import { ProductManager } from '../managers/product.manager';
import { ProductEntity } from '../models/entities/product.entity';

@Controller('products')
export class ProductController {
  constructor(private productsManager: ProductManager) {}

  @Get()
  async get(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
    @Query('size', new DefaultValuePipe(100), ParseIntPipe) size?: number,
    @Query('orderBy') orderBy?: string,
    @Query('orderDirection') orderDirection?: string,
  ): Promise<IListDto<ProductEntity>> {
    return this.productsManager.findAll({
      page,
      size,
      orderBy,
      orderDirection,
    });
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
