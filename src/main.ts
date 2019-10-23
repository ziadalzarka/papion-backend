import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigUtils } from './config/config.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = ConfigUtils.metadata.port;
  await app.listen(port);
  app.enableCors({ credentials: true });
  app.getHttpAdapter().use(cookieParser());
  Logger.log(`App running at: http://localhost:${port}`);
}
bootstrap();
