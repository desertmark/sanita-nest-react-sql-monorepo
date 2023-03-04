import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { ManagersModule } from '../managers/managers.module';
import { ProductController } from './product.controller';

@Module({
  imports: [
    ConfigModule,
    ManagersModule.register({
      repository: (process.env.REPOSITORY as 'sql' | 'cosmos') || 'sql',
    }),
  ],
  controllers: [ProductController],
})
export class ControllersModule {}
