import { HttpException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';

import type {
  AuthTokenPayload,
  TokenService,
} from '../../identity/application/ports/token-service';
import type { ReportDto } from '../application/dto/report.dto';
import { ModerationController } from './moderation.controller';

const report: ReportDto = {
  id: 'report-1',
  reporter: {
    id: 'user-1',
    username: 'lyra-oraculo',
    displayName: 'Lyra del Oraculo',
  },
  targetType: 'LISTING',
  listing: {
    id: 'listing-1',
    slug: 'reloj',
    title: 'Reloj imposible',
    status: 'PUBLISHED',
  },
  reportedUser: null,
  reason: 'FORBIDDEN_OBJECT',
  description: 'Objeto con riesgo dimensional.',
  status: 'PENDING',
  resolution: null,
  resolvedBy: null,
  resolvedAt: null,
  createdAt: '2026-07-09T12:00:00.000Z',
  updatedAt: '2026-07-09T12:00:00.000Z',
};

const userPayload: AuthTokenPayload = {
  sub: 'user-1',
  username: 'lyra-oraculo',
  role: 'USER',
  kind: 'access',
};

const moderatorPayload: AuthTokenPayload = {
  ...userPayload,
  sub: 'moderator-1',
  username: 'io-horizonte',
  role: 'MODERATOR',
};

function createTokenService(payload: AuthTokenPayload): TokenService {
  return {
    issueAccessToken: () => 'access-token',
    issueRefreshToken: () => 'refresh-token',
    verify: () => payload,
    hashRefreshToken: () => 'refresh-token-hash',
  };
}

describe('ModerationController', () => {
  it('creates listing reports using the authenticated reporter', async () => {
    let received: { reporterId: string; listingSlug: string } | null = null;
    const controller = new ModerationController(
      {
        execute: async (reporterId, input) => {
          received = {
            reporterId,
            listingSlug: input.listingSlug,
          };
          return report;
        },
      },
      {
        execute: async () => report,
      },
      {
        execute: async () => [],
      },
      {
        execute: async () => report,
      },
      {
        execute: async () => ({ slug: 'reloj', status: 'BLOCKED' }),
      },
      {
        execute: async () => ({ username: 'nadir-cronal', status: 'BLOCKED' }),
      },
      createTokenService(userPayload),
    );

    await expect(
      controller.reportListing('Bearer access-token', 'reloj', {
        reason: 'FORBIDDEN_OBJECT',
        description: 'Objeto con riesgo dimensional.',
      }),
    ).resolves.toEqual(report);
    expect(received).toEqual({
      reporterId: 'user-1',
      listingSlug: 'reloj',
    });
  });

  it('requires moderator role to list reports', async () => {
    const userController = new ModerationController(
      {
        execute: async () => report,
      },
      {
        execute: async () => report,
      },
      {
        execute: async () => [report],
      },
      {
        execute: async () => report,
      },
      {
        execute: async () => ({ slug: 'reloj', status: 'BLOCKED' }),
      },
      {
        execute: async () => ({ username: 'nadir-cronal', status: 'BLOCKED' }),
      },
      createTokenService(userPayload),
    );
    const moderatorController = new ModerationController(
      {
        execute: async () => report,
      },
      {
        execute: async () => report,
      },
      {
        execute: async () => [report],
      },
      {
        execute: async () => report,
      },
      {
        execute: async () => ({ slug: 'reloj', status: 'BLOCKED' }),
      },
      {
        execute: async () => ({ username: 'nadir-cronal', status: 'BLOCKED' }),
      },
      createTokenService(moderatorPayload),
    );

    await expect(userController.listReports('Bearer access-token')).rejects.toBeInstanceOf(
      HttpException,
    );
    await expect(moderatorController.listReports('Bearer access-token')).resolves.toEqual([report]);
  });

  it('rejects requests without authorization', async () => {
    const controller = new ModerationController(
      {
        execute: async () => report,
      },
      {
        execute: async () => report,
      },
      {
        execute: async () => [],
      },
      {
        execute: async () => report,
      },
      {
        execute: async () => ({ slug: 'reloj', status: 'BLOCKED' }),
      },
      {
        execute: async () => ({ username: 'nadir-cronal', status: 'BLOCKED' }),
      },
      createTokenService(userPayload),
    );

    await expect(
      controller.reportListing(undefined, 'reloj', {
        reason: 'FORBIDDEN_OBJECT',
        description: 'Objeto con riesgo dimensional.',
      }),
    ).rejects.toBeInstanceOf(HttpException);
  });
});
