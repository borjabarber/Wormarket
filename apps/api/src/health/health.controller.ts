import { Controller, Get, Inject, ServiceUnavailableException } from '@nestjs/common';

import { PrismaService } from '../infrastructure/prisma/prisma.service';

type HealthStatus = 'ok' | 'error';

type HealthResponse = {
  checks: {
    api: HealthStatus;
    database?: HealthStatus;
  };
  status: 'ok';
  service: 'wormarket-api';
  timestamp: string;
};

@Controller('health')
export class HealthController {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  @Get()
  getHealth(): HealthResponse {
    return this.getLive();
  }

  @Get('live')
  getLive(): HealthResponse {
    return {
      checks: {
        api: 'ok',
      },
      status: 'ok',
      service: 'wormarket-api',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('ready')
  async getReady(): Promise<HealthResponse> {
    const timestamp = new Date().toISOString();

    try {
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        checks: {
          api: 'ok',
          database: 'ok',
        },
        status: 'ok',
        service: 'wormarket-api',
        timestamp,
      };
    } catch {
      throw new ServiceUnavailableException({
        checks: {
          api: 'ok',
          database: 'error',
        },
        status: 'error',
        service: 'wormarket-api',
        timestamp,
      });
    }
  }
}
