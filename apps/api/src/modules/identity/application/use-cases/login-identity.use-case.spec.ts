import { describe, expect, it } from 'vitest';

import { IdentityAccount } from '../../domain/entities/identity-account';
import type { IdentityRepository } from '../../domain/repositories/identity.repository';
import type { PasswordHasher } from '../ports/password-hasher';
import type { TokenService } from '../ports/token-service';
import { LoginIdentityUseCase } from './login-identity.use-case';

const account = IdentityAccount.create({
  id: 'identity-1',
  email: 'lyra@wormarket.local',
  passwordHash: 'hashed-password',
  refreshTokenHash: null,
  user: {
    id: 'user-1',
    username: 'lyra-oraculo',
    displayName: 'Lyra del Oraculo',
    role: 'USER',
  },
  createdAt: new Date('2026-07-09T00:00:00.000Z'),
  updatedAt: new Date('2026-07-09T00:00:00.000Z'),
});

const tokenService: TokenService = {
  issueAccessToken: () => 'access-token',
  issueRefreshToken: () => 'refresh-token',
  verify: () => ({
    sub: 'user-1',
    username: 'lyra-oraculo',
    role: 'USER',
    kind: 'access',
  }),
  hashRefreshToken: () => 'refresh-token-hash',
};

describe('LoginIdentityUseCase', () => {
  it('returns tokens for valid credentials', async () => {
    const repository: IdentityRepository = {
      findByEmail: async () => account,
      findByUserId: async () => null,
      usernameExists: async () => false,
      register: async () => account,
      saveRefreshTokenHash: async () => undefined,
      clearRefreshTokenHash: async () => undefined,
    };
    const passwordHasher: PasswordHasher = {
      hash: () => 'hashed-password',
      verify: () => true,
    };
    const useCase = new LoginIdentityUseCase(repository, passwordHasher, tokenService);

    await expect(
      useCase.execute({
        email: 'lyra@wormarket.local',
        password: 'Portal123',
      }),
    ).resolves.toMatchObject({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
  });

  it('rejects invalid credentials', async () => {
    const repository: IdentityRepository = {
      findByEmail: async () => account,
      findByUserId: async () => null,
      usernameExists: async () => false,
      register: async () => account,
      saveRefreshTokenHash: async () => undefined,
      clearRefreshTokenHash: async () => undefined,
    };
    const passwordHasher: PasswordHasher = {
      hash: () => 'hashed-password',
      verify: () => false,
    };
    const useCase = new LoginIdentityUseCase(repository, passwordHasher, tokenService);

    await expect(
      useCase.execute({
        email: 'lyra@wormarket.local',
        password: 'Wrong123',
      }),
    ).rejects.toMatchObject({
      code: 'INVALID_CREDENTIALS',
    });
  });
});
