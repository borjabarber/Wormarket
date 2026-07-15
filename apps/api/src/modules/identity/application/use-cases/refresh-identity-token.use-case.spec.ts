import { describe, expect, it } from 'vitest';

import { IdentityAccount } from '../../domain/entities/identity-account';
import type { IdentityRepository } from '../../domain/repositories/identity.repository';
import type { TokenService } from '../ports/token-service';
import { RefreshIdentityTokenUseCase } from './refresh-identity-token.use-case';

const account = IdentityAccount.create({
  id: 'identity-1',
  email: 'lyra@wormarket.local',
  passwordHash: 'hashed-password',
  refreshTokenHash: 'refresh-token-hash',
  user: {
    id: 'user-1',
    username: 'lyra-oraculo',
    displayName: 'Lyra del Oraculo',
    role: 'USER',
  },
  createdAt: new Date('2026-07-09T00:00:00.000Z'),
  updatedAt: new Date('2026-07-09T00:00:00.000Z'),
});

function createRepository(overrides: Partial<IdentityRepository> = {}): IdentityRepository {
  return {
    findByEmail: async () => null,
    findByUserId: async () => account,
    usernameExists: async () => false,
    register: async () => account,
    saveRefreshTokenHash: async () => undefined,
    clearRefreshTokenHash: async () => undefined,
    ...overrides,
  };
}

function createTokenService(overrides: Partial<TokenService> = {}): TokenService {
  return {
    issueAccessToken: () => 'next-access-token',
    issueRefreshToken: () => 'next-refresh-token',
    verify: () => ({
      sub: 'user-1',
      username: 'lyra-oraculo',
      role: 'USER',
      kind: 'refresh',
    }),
    hashRefreshToken: (token) =>
      token === 'valid-refresh-token' ? 'refresh-token-hash' : 'next-refresh-token-hash',
    ...overrides,
  };
}

describe('RefreshIdentityTokenUseCase', () => {
  it('rotates tokens when the refresh token hash matches', async () => {
    let savedHash: string | null = null;
    const useCase = new RefreshIdentityTokenUseCase(
      createRepository({
        saveRefreshTokenHash: async (_userId, refreshTokenHash) => {
          savedHash = refreshTokenHash;
        },
      }),
      createTokenService(),
    );

    await expect(useCase.execute('valid-refresh-token')).resolves.toMatchObject({
      accessToken: 'next-access-token',
      refreshToken: 'next-refresh-token',
    });
    expect(savedHash).toBe('next-refresh-token-hash');
  });

  it('rejects refresh tokens whose hash does not match', async () => {
    const useCase = new RefreshIdentityTokenUseCase(
      createRepository(),
      createTokenService({
        hashRefreshToken: () => 'different-refresh-token-hash',
      }),
    );

    await expect(useCase.execute('stolen-refresh-token')).rejects.toMatchObject({
      code: 'INVALID_REFRESH_TOKEN',
    });
  });
});
