import type {
  IdentityAccount as PrismaIdentityAccount,
  User as PrismaUser,
} from '../../../../generated/prisma/client';
import { IdentityAccount } from '../../domain/entities/identity-account';

export type PrismaIdentityAccountWithUser = PrismaIdentityAccount & {
  user: Pick<PrismaUser, 'id' | 'username' | 'displayName' | 'role'>;
};

export class PrismaIdentityMapper {
  static toDomain(record: PrismaIdentityAccountWithUser): IdentityAccount {
    return IdentityAccount.create({
      id: record.id,
      email: record.email,
      passwordHash: record.passwordHash,
      refreshTokenHash: record.refreshTokenHash,
      user: {
        id: record.user.id,
        username: record.user.username,
        displayName: record.user.displayName,
        role: record.user.role,
      },
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
