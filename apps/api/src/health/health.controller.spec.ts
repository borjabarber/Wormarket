import { describe, expect, it } from 'vitest';

import type { PrismaService } from '../infrastructure/prisma/prisma.service';
import { HealthController } from './health.controller';

function createPrismaService(shouldFail = false): PrismaService {
  return {
    $queryRaw: async () => {
      if (shouldFail) {
        throw new Error('database unavailable');
      }

      return [{ result: 1 }];
    },
  } as unknown as PrismaService;
}

describe('HealthController', () => {
  it('returns the API health status', () => {
    const controller = new HealthController(createPrismaService());

    const response = controller.getHealth();

    expect(response.status).toBe('ok');
    expect(response.service).toBe('wormarket-api');
    expect(response.checks).toEqual({ api: 'ok' });
    expect(Date.parse(response.timestamp)).not.toBeNaN();
  });

  it('returns liveness without checking database connectivity', () => {
    const controller = new HealthController(createPrismaService(true));

    const response = controller.getLive();

    expect(response).toEqual(
      expect.objectContaining({
        checks: { api: 'ok' },
        service: 'wormarket-api',
        status: 'ok',
      }),
    );
  });

  it('returns readiness when the database responds', async () => {
    const controller = new HealthController(createPrismaService());

    await expect(controller.getReady()).resolves.toEqual(
      expect.objectContaining({
        checks: {
          api: 'ok',
          database: 'ok',
        },
        service: 'wormarket-api',
        status: 'ok',
      }),
    );
  });

  it('maps database readiness failures to a safe service unavailable response', async () => {
    const controller = new HealthController(createPrismaService(true));

    await expect(controller.getReady()).rejects.toMatchObject({
      response: expect.objectContaining({
        checks: {
          api: 'ok',
          database: 'error',
        },
        service: 'wormarket-api',
        status: 'error',
      }),
      status: 503,
    });
  });
});
