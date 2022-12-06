import { Module } from '@nestjs/common';
import { ConfigModule } from '../../src/config/config.module';
import { ManagersModule } from '../../src/managers/managers.module';
import { ProductController } from './product.controller';

@Module({
  imports: [ConfigModule, ManagersModule],
  controllers: [ProductController],
})
export class ControllersModule {}
