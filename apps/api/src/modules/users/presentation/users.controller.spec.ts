import { NotFoundException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';

import type { UserProfileDto } from '../application/dto/user-profile.dto';
import { UsersController } from './users.controller';

const user: UserProfileDto = {
  id: 'user-1',
  username: 'lyra-oraculo',
  displayName: 'Lyra del Oraculo',
  bio: 'Tasadora de reliquias imposibles.',
  avatarUrl: null,
  homeDimension: {
    id: 'dimension-1',
    slug: 'oraculo-norte',
    name: 'Oraculo Norte',
  },
  reputation: 42,
  role: 'USER',
};

describe('UsersController', () => {
  it('lists public user profiles through the use case', async () => {
    const controller = new UsersController(
      {
        execute: async () => [user],
      },
      {
        execute: async () => null,
      },
    );

    await expect(controller.listUsers()).resolves.toEqual([user]);
  });

  it('returns a public user profile by username', async () => {
    const controller = new UsersController(
      {
        execute: async () => [],
      },
      {
        execute: async () => user,
      },
    );

    await expect(controller.getUserProfile('lyra-oraculo')).resolves.toEqual(user);
  });

  it('throws a not found error for unknown usernames', async () => {
    const controller = new UsersController(
      {
        execute: async () => [],
      },
      {
        execute: async () => null,
      },
    );

    await expect(controller.getUserProfile('missing-user')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
