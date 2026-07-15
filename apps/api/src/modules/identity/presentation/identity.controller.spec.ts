import type { HttpException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';

import type { AuthResponseDto } from '../application/dto/auth-response.dto';
import { IdentityError } from '../application/errors/identity-error';
import { IdentityController } from './identity.controller';

const authResponse: AuthResponseDto = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  user: {
    id: 'user-1',
    username: 'lyra-oraculo',
    displayName: 'Lyra del Oraculo',
    role: 'USER',
  },
};

describe('IdentityController', () => {
  it('registers through the use case', async () => {
    const controller = new IdentityController(
      {
        execute: async () => authResponse,
      },
      {
        execute: async () => authResponse,
      },
      {
        execute: async () => authResponse,
      },
      {
        execute: async () => ({ user: authResponse.user }),
      },
      {
        execute: async () => undefined,
      },
    );

    await expect(
      controller.register({
        email: 'lyra@wormarket.local',
        password: 'Portal123',
        username: 'lyra-oraculo',
        displayName: 'Lyra del Oraculo',
        bio: 'Tasadora de reliquias.',
        homeDimensionSlug: 'oraculo-norte',
      }),
    ).resolves.toEqual(authResponse);
  });

  it('maps identity errors to their HTTP status code', async () => {
    const controller = new IdentityController(
      {
        execute: async () => {
          throw new IdentityError('EMAIL_ALREADY_REGISTERED', 'El email ya esta registrado.', 409);
        },
      },
      {
        execute: async () => authResponse,
      },
      {
        execute: async () => authResponse,
      },
      {
        execute: async () => ({ user: authResponse.user }),
      },
      {
        execute: async () => undefined,
      },
    );

    await expect(
      controller.register({
        email: 'lyra@wormarket.local',
        password: 'Portal123',
        username: 'lyra-oraculo',
        displayName: 'Lyra del Oraculo',
        bio: 'Tasadora de reliquias.',
        homeDimensionSlug: 'oraculo-norte',
      }),
    ).rejects.toMatchObject({
      status: 409,
    } satisfies Partial<HttpException>);
  });
});
