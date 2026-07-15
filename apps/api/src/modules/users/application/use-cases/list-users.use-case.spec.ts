import { describe, expect, it } from 'vitest';

import { User } from '../../domain/entities/user';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { ListUsersUseCase } from './list-users.use-case';

function createUser(username: string): User {
  return User.create({
    id: username,
    username,
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
}

describe('ListUsersUseCase', () => {
  it('returns users as public profile DTOs', async () => {
    const repository: UserRepository = {
      findAll: async () => [createUser('lyra-oraculo')],
      findByUsername: async () => null,
    };
    const useCase = new ListUsersUseCase(repository);

    const result = await useCase.execute();

    expect(result).toEqual([
      {
        id: 'lyra-oraculo',
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
        status: 'ACTIVE',
      },
    ]);
  });
});
