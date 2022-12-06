import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CONFIG, IConfig } from './config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { server } = await app.resolve<IConfig>(CONFIG);
  const logger = await app.resolve(Logger);
  await app.listen(server.port, server.host, () => {
    logger.log(`🚀  Server ready at http://${server.host}:${server.port}`);
  });
}
bootstrap();
