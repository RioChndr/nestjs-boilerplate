import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

export function CorsConfig(): CorsOptions {
  return {
    origin: process.env.CORS_ORIGIN_WHITELIST || 'http://localhost:3000',
    allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
    preflightContinue: false,
    credentials: true
  }
}