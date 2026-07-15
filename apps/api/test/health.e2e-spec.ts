import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { HealthModule } from '../src/health/health.module';
import { PrismaService } from '../src/infrastructure/prisma/prisma.service';

describe('Health endpoints', () => {
  let app: INestApplication;
  const queryRaw = vi.fn();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HealthModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        $queryRaw: queryRaw,
      })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    queryRaw.mockResolvedValue([{ result: 1 }]);
  });

  afterAll(async () => {
    await app.close();
  });

  it('responds with the API health payload', async () => {
    const response = await request(app.getHttpServer()).get('/health').expect(200);

    expect(response.body.status).toBe('ok');
    expect(response.body.service).toBe('wormarket-api');
    expect(response.body.checks).toEqual({ api: 'ok' });
    expect(Date.parse(response.body.timestamp)).not.toBeNaN();
    expect(queryRaw).not.toHaveBeenCalled();
  });

  it('responds to liveness without checking persistence', async () => {
    const response = await request(app.getHttpServer()).get('/health/live').expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        checks: { api: 'ok' },
        service: 'wormarket-api',
        status: 'ok',
      }),
    );
    expect(queryRaw).not.toHaveBeenCalled();
  });

  it('responds to readiness when persistence is available', async () => {
    const response = await request(app.getHttpServer()).get('/health/ready').expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        checks: {
          api: 'ok',
          database: 'ok',
        },
        service: 'wormarket-api',
        status: 'ok',
      }),
    );
    expect(queryRaw).toHaveBeenCalledOnce();
  });

  it('responds to readiness failures without exposing internal details', async () => {
    queryRaw.mockRejectedValue(new Error('postgres://secret-password@localhost'));

    const response = await request(app.getHttpServer()).get('/health/ready').expect(503);

    expect(response.body).toEqual(
      expect.objectContaining({
        checks: {
          api: 'ok',
          database: 'error',
        },
        service: 'wormarket-api',
        status: 'error',
      }),
    );
    expect(JSON.stringify(response.body)).not.toContain('secret-password');
  });
});
