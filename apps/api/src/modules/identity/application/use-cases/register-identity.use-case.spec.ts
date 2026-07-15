import { describe, expect, it } from 'vitest';

import { IdentityAccount } from '../../domain/entities/identity-account';
import type {
  IdentityRepository,
  RegisterIdentityAccountInput,
} from '../../domain/repositories/identity.repository';
import type { PasswordHasher } from '../ports/password-hasher';
import type { TokenService } from '../ports/token-service';
import { RegisterIdentityUseCase } from './register-identity.use-case';

function createAccount(input?: Partial<RegisterIdentityAccountInput>): IdentityAccount {
  return IdentityAccount.create({
    id: 'identity-1',
    email: input?.email ?? 'lyra@wormarket.local',
    passwordHash: input?.passwordHash ?? 'hashed-password',
    refreshTokenHash: null,
    user: {
      id: 'user-1',
      username: input?.username ?? 'lyra-oraculo',
      displayName: input?.displayName ?? 'Lyra del Oraculo',
      role: 'USER',
    },
    createdAt: new Date('2026-07-09T00:00:00.000Z'),
    updatedAt: new Date('2026-07-09T00:00:00.000Z'),
  });
}

const passwordHasher: PasswordHasher = {
  hash: () => 'hashed-password',
  verify: () => true,
};

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

describe('RegisterIdentityUseCase', () => {
  it('registers an account and stores the refresh token hash', async () => {
    let storedRefreshTokenHash: string | null = null;
    const repository: IdentityRepository = {
      findByEmail: async () => null,
      findByUserId: async () => null,
      usernameExists: async () => false,
      register: async (input) => createAccount(input),
      saveRefreshTokenHash: async (_userId, refreshTokenHash) => {
        storedRefreshTokenHash = refreshTokenHash;
      },
      clearRefreshTokenHash: async () => undefined,
    };
    const useCase = new RegisterIdentityUseCase(repository, passwordHasher, tokenService);

    const result = await useCase.execute({
      email: 'lyra@wormarket.local',
      password: 'Portal123',
      username: 'lyra-oraculo',
      displayName: 'Lyra del Oraculo',
      bio: 'Tasadora de reliquias.',
      homeDimensionSlug: 'oraculo-norte',
    });

    expect(result).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user: {
        id: 'user-1',
        username: 'lyra-oraculo',
        displayName: 'Lyra del Oraculo',
        role: 'USER',
      },
    });
    expect(storedRefreshTokenHash).toBe('refresh-token-hash');
  });

  it('rejects weak passwords', async () => {
    const repository: IdentityRepository = {
      findByEmail: async () => null,
      findByUserId: async () => null,
      usernameExists: async () => false,
      register: async () => createAccount(),
      saveRefreshTokenHash: async () => undefined,
      clearRefreshTokenHash: async () => undefined,
    };
    const useCase = new RegisterIdentityUseCase(repository, passwordHasher, tokenService);

    await expect(
      useCase.execute({
        email: 'lyra@wormarket.local',
        password: 'weak',
        username: 'lyra-oraculo',
        displayName: 'Lyra del Oraculo',
        bio: 'Tasadora de reliquias.',
        homeDimensionSlug: 'oraculo-norte',
      }),
    ).rejects.toMatchObject({
      code: 'PASSWORD_TOO_WEAK',
    });
  });
});
