import { ConsoleLogger, Logger, Module, Provider } from '@nestjs/common';
import { ConfigService } from './config.service';

const PROVIDERS: Provider[] = [
  ConfigService,
  {
    provide: Logger,
    useFactory: () => new ConsoleLogger('___PRODUCTS___'),
  },
];
@Module({
  imports: [],
  providers: PROVIDERS,
  exports: PROVIDERS,
})
export class ConfigModule {}
