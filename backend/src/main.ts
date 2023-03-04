
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

const BANNER = `
███████╗ █████╗ ███╗   ██╗██╗████████╗ █████╗ 
██╔════╝██╔══██╗████╗  ██║██║╚══██╔══╝██╔══██╗
███████╗███████║██╔██╗ ██║██║   ██║   ███████║
╚════██║██╔══██║██║╚██╗██║██║   ██║   ██╔══██║
███████║██║  ██║██║ ╚████║██║   ██║   ██║  ██║
╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝   ╚═╝  ╚═╝                                              
`;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const { server } = (await app.resolve<ConfigService>(ConfigService)).config;
  const logger = await app.resolve(Logger);
  await app.listen(server.port, server.host, () => {
    logger.log(BANNER);
    logger.log(`🚀  Server ready at http://${server.host}:${server.port}`);
  });
}
bootstrap();
