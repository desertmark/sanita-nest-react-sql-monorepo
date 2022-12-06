import { ConsoleLogger, Logger, Module, Provider } from '@nestjs/common';
import { CONFIG, config } from './config';

const PROVIDERS: Provider[] = [
  {
    provide: CONFIG,
    useValue: config,
  },
  {
    provide: Logger,
    useFactory: () => new ConsoleLogger('products'),
  },
];
@Module({
  imports: [],
  providers: PROVIDERS,
  exports: PROVIDERS,
})
export class ConfigModule {}
