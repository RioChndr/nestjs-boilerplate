import { Injectable } from '@nestjs/common';
import { hostname } from 'os';
import { CorsConfig } from '../../cors';

@Injectable()
export class HealthService {
  getHealth() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      hostname: hostname(),
      application: {
        version: '1.0.0', // Consider dynamically fetching this
        environment: process.env.NODE_ENV || 'development',
        cors: isDevelopment ? CorsConfig() : undefined,
      },
      dependencies: {
      },
    }
  }
}
