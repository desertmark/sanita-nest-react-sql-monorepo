import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { CosmosService } from './cosmos.service';

@Module({
  imports: [ConfigModule],
  providers: [CosmosService],
  exports: [CosmosService],
})
export class CosmosModule implements OnModuleInit {
  constructor(private cosmosService: CosmosService) {}

  async onModuleInit() {
    await this.cosmosService.createDb();
  }
}
