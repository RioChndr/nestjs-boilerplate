import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from './api/api.module';
import * as Joi from 'joi';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        name: 'Nestjs',
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport: {
          targets: [
            {
              target: 'pino-pretty',
              level: 'debug',
              options: {
                colorize: true,
                ignore: 'req.headers,res.headers',
              },
            },
            {
              target: 'pino/file',
              level: 'debug',
              options: {
                destination: './logs/app.log',
                mkdir: true,
              },
            },
            {
              target: 'pino/file',
              level: 'error',
              options: {
                destination: './logs/app-error.log',
                mkdir: true,
              },
            },
          ],
        },
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        SWAGGER_ENABLED: Joi.boolean().default(false),
        SWAGGER_SERVER_URL: Joi.string().default('http://localhost:3000|Localhost'),
        SWAGGER_URL: Joi.string().default('documentation'),
        CORS_ORIGIN_WHITELIST: Joi.string().default('http://localhost:3000')
      })
    }),
    ApiModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
