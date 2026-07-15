import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { FavoriteError } from '../../application/errors/favorite-error';
import type { Favorite } from '../../domain/entities/favorite';
import type { FavoriteRepository } from '../../domain/repositories/favorite.repository';
import { PrismaFavoriteMapper } from './prisma-favorite.mapper';

const favoriteInclude = {
  user: {
    select: {
      id: true,
      username: true,
      displayName: true,
    },
  },
  listing: {
    include: {
      seller: {
        select: {
          id: true,
          username: true,
          displayName: true,
        },
      },
      dimension: {
        select: {
          id: true,
          slug: true,
          name: true,
        },
      },
    },
  },
};

@Injectable()
export class PrismaFavoriteRepository implements FavoriteRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<Favorite[]> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new FavoriteError('USER_NOT_FOUND', 'El usuario no existe.', 404);
    }

    const favorites = await this.prisma.favorite.findMany({
      where: {
        userId,
      },
      include: favoriteInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return favorites.map((favorite) => PrismaFavoriteMapper.toDomain(favorite));
  }

  async add(userId: string, listingSlug: string): Promise<Favorite> {
    const [user, listing] = await Promise.all([
      this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
        },
      }),
      this.prisma.listing.findUnique({
        where: {
          slug: listingSlug,
        },
        select: {
          id: true,
        },
      }),
    ]);

    if (!user) {
      throw new FavoriteError('USER_NOT_FOUND', 'El usuario no existe.', 404);
    }

    if (!listing) {
      throw new FavoriteError('LISTING_NOT_FOUND', 'El anuncio no existe.', 404);
    }

    const favorite = await this.prisma.favorite.upsert({
      where: {
        userId_listingId: {
          userId,
          listingId: listing.id,
        },
      },
      update: {},
      create: {
        userId,
        listingId: listing.id,
      },
      include: favoriteInclude,
    });

    return PrismaFavoriteMapper.toDomain(favorite);
  }

  async remove(userId: string, listingSlug: string): Promise<void> {
    const listing = await this.prisma.listing.findUnique({
      where: {
        slug: listingSlug,
      },
      select: {
        id: true,
      },
    });

    if (!listing) {
      throw new FavoriteError('LISTING_NOT_FOUND', 'El anuncio no existe.', 404);
    }

    await this.prisma.favorite.deleteMany({
      where: {
        userId,
        listingId: listing.id,
      },
    });
  }
}
