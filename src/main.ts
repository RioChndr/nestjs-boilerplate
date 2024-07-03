import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { initSwagger } from './swagger';
import { CorsConfig } from './cors';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { ValidationPipe, Logger as LoggerNest } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(CorsConfig());
  app.use(cookieParser())
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  if (process.env.NODE_ENV !== 'production' && process.env.SWAGGER_ENABLED === 'true') {
    initSwagger(app)
  }

  await app.listen(process.env.PORT || 4000);

  const logger = new LoggerNest('Bootstrap');
  logger.log(`Application is running on ${await app.getUrl()}`)
}
bootstrap();
