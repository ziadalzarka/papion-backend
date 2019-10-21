import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  app.enableCors({ credentials: true });
  app.getHttpAdapter().use(cookieParser());
  Logger.log('App running at: http://localhost:3000');
}
bootstrap();
