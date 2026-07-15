import type {
  Dimension as PrismaDimension,
  User as PrismaUser,
} from '../../../../generated/prisma/client';
import { User } from '../../domain/entities/user';

export type PrismaUserWithHomeDimension = PrismaUser & {
  homeDimension: Pick<PrismaDimension, 'id' | 'slug' | 'name'>;
};

export class PrismaUserMapper {
  static toDomain(record: PrismaUserWithHomeDimension): User {
    return User.create({
      id: record.id,
      username: record.username,
      displayName: record.displayName,
      bio: record.bio,
      avatarUrl: record.avatarUrl,
      homeDimension: {
        id: record.homeDimension.id,
        slug: record.homeDimension.slug,
        name: record.homeDimension.name,
      },
      reputation: record.reputation,
      role: record.role,
      status: record.status,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
