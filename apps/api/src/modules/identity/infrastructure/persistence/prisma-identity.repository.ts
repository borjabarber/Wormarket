import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import type { IdentityAccount } from '../../domain/entities/identity-account';
import type {
  IdentityRepository,
  RegisterIdentityAccountInput,
} from '../../domain/repositories/identity.repository';
import { IdentityError } from '../../application/errors/identity-error';
import { PrismaIdentityMapper } from './prisma-identity.mapper';

const identityInclude = {
  user: {
    select: {
      id: true,
      username: true,
      displayName: true,
      role: true,
    },
  },
};

@Injectable()
export class PrismaIdentityRepository implements IdentityRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<IdentityAccount | null> {
    const account = await this.prisma.identityAccount.findUnique({
      where: {
        email,
      },
      include: identityInclude,
    });

    return account ? PrismaIdentityMapper.toDomain(account) : null;
  }

  async findByUserId(userId: string): Promise<IdentityAccount | null> {
    const account = await this.prisma.identityAccount.findUnique({
      where: {
        userId,
      },
      include: identityInclude,
    });

    return account ? PrismaIdentityMapper.toDomain(account) : null;
  }

  async usernameExists(username: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });

    return Boolean(user);
  }

  async register(input: RegisterIdentityAccountInput): Promise<IdentityAccount> {
    const homeDimension = await this.prisma.dimension.findUnique({
      where: {
        slug: input.homeDimensionSlug,
      },
      select: {
        id: true,
      },
    });

    if (!homeDimension) {
      throw new IdentityError('DIMENSION_NOT_FOUND', 'La dimension de origen no existe.', 404);
    }

    const account = await this.prisma.$transaction(async (transaction) => {
      const user = await transaction.user.create({
        data: {
          username: input.username,
          displayName: input.displayName.trim(),
          bio: input.bio.trim(),
          homeDimensionId: homeDimension.id,
        },
      });

      return transaction.identityAccount.create({
        data: {
          email: input.email,
          passwordHash: input.passwordHash,
          userId: user.id,
        },
        include: identityInclude,
      });
    });

    return PrismaIdentityMapper.toDomain(account);
  }

  async saveRefreshTokenHash(userId: string, refreshTokenHash: string): Promise<void> {
    await this.prisma.identityAccount.update({
      where: {
        userId,
      },
      data: {
        refreshTokenHash,
      },
    });
  }

  async clearRefreshTokenHash(userId: string): Promise<void> {
    await this.prisma.identityAccount.update({
      where: {
        userId,
      },
      data: {
        refreshTokenHash: null,
      },
    });
  }
}
