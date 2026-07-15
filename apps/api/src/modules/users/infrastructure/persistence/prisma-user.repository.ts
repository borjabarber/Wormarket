import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import type { User } from '../../domain/entities/user';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { PrismaUserMapper } from './prisma-user.mapper';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      include: {
        homeDimension: true,
      },
      orderBy: {
        displayName: 'asc',
      },
    });

    return users.map((user) => PrismaUserMapper.toDomain(user));
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        homeDimension: true,
      },
    });

    return user ? PrismaUserMapper.toDomain(user) : null;
  }
}
