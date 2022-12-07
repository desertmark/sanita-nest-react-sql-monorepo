import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { ManagersModule } from '../managers/managers.module';
import { ProductController } from './product.controller';

@Module({
  imports: [ConfigModule, ManagersModule],
  controllers: [ProductController],
})
export class ControllersModule {}
