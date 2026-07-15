import { Module } from '@nestjs/common';

import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
  providers: [PrismaService],
})
export class HealthModule {}
