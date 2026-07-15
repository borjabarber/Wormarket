import { describe, expect, it } from 'vitest';

import { User } from '../../domain/entities/user';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { GetUserProfileUseCase } from './get-user-profile.use-case';

const user = User.create({
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
  createdAt: new Date('2026-07-09T00:00:00.000Z'),
  updatedAt: new Date('2026-07-09T00:00:00.000Z'),
});

describe('GetUserProfileUseCase', () => {
  it('returns the requested user profile', async () => {
    const repository: UserRepository = {
      findAll: async () => [],
      findByUsername: async () => user,
    };
    const useCase = new GetUserProfileUseCase(repository);

    await expect(useCase.execute('lyra-oraculo')).resolves.toMatchObject({
      username: 'lyra-oraculo',
      homeDimension: {
        slug: 'oraculo-norte',
      },
    });
  });

  it('returns null when the user does not exist', async () => {
    const repository: UserRepository = {
      findAll: async () => [],
      findByUsername: async () => null,
    };
    const useCase = new GetUserProfileUseCase(repository);

    await expect(useCase.execute('missing-user')).resolves.toBeNull();
  });
});
