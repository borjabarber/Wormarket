import type { IdentityAccount } from '../entities/identity-account';

export const IDENTITY_REPOSITORY = Symbol('IDENTITY_REPOSITORY');

export type RegisterIdentityAccountInput = {
  email: string;
  passwordHash: string;
  username: string;
  displayName: string;
  bio: string;
  homeDimensionSlug: string;
};

export interface IdentityRepository {
  findByEmail(email: string): Promise<IdentityAccount | null>;
  findByUserId(userId: string): Promise<IdentityAccount | null>;
  usernameExists(username: string): Promise<boolean>;
  register(input: RegisterIdentityAccountInput): Promise<IdentityAccount>;
  saveRefreshTokenHash(userId: string, refreshTokenHash: string): Promise<void>;
  clearRefreshTokenHash(userId: string): Promise<void>;
}
