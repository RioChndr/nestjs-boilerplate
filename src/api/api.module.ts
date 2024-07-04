import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [HealthModule, UserModule]
})
export class ApiModule {}
