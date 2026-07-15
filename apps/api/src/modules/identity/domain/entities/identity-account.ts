import type { UserRole } from '../../../users/domain/entities/user';
import { Email } from '../value-objects/email';

export type AuthenticatedUser = {
  id: string;
  username: string;
  displayName: string;
  role: UserRole;
};

type IdentityAccountProperties = {
  id: string;
  email: Email;
  passwordHash: string;
  refreshTokenHash: string | null;
  user: AuthenticatedUser;
  createdAt: Date;
  updatedAt: Date;
};

type CreateIdentityAccountInput = Omit<IdentityAccountProperties, 'email'> & {
  email: string;
};

export class IdentityAccount {
  private constructor(private readonly properties: IdentityAccountProperties) {}

  static create(input: CreateIdentityAccountInput): IdentityAccount {
    if (input.id.trim().length === 0) {
      throw new Error('Identity account id cannot be empty.');
    }

    if (input.passwordHash.trim().length === 0) {
      throw new Error('Identity account password hash cannot be empty.');
    }

    return new IdentityAccount({
      ...input,
      id: input.id.trim(),
      email: Email.create(input.email),
      user: { ...input.user },
    });
  }

  get id(): string {
    return this.properties.id;
  }

  get email(): Email {
    return this.properties.email;
  }

  get passwordHash(): string {
    return this.properties.passwordHash;
  }

  get refreshTokenHash(): string | null {
    return this.properties.refreshTokenHash;
  }

  get user(): AuthenticatedUser {
    return { ...this.properties.user };
  }

  get createdAt(): Date {
    return this.properties.createdAt;
  }

  get updatedAt(): Date {
    return this.properties.updatedAt;
  }
}
