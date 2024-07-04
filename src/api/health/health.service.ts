import { Injectable } from '@nestjs/common';
import { hostname } from 'os';
import { CorsConfig } from '../../cors';
import { PrismaService } from '../../provider/prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(
    private readonly db: PrismaService
  ) { }

  async testDbQuery() {
    try {
      const res = await this.db.$queryRaw`SELECT 1;`;
      return res ? 'ok' : 'error';
    } catch (e) {
      return 'error';
    }
  }

  async getHealth() {
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
        database: await this.testDbQuery(),
      },
    }
  }
}
