import { Controller, Get } from '@nestjs/common';

type HealthResponse = {
  status: 'ok';
  service: 'wormarket-api';
  timestamp: string;
};

@Controller('health')
export class HealthController {
  @Get()
  getHealth(): HealthResponse {
    return {
      status: 'ok',
      service: 'wormarket-api',
      timestamp: new Date().toISOString(),
    };
  }
}
