import type {
  Dimension as PrismaDimension,
  Favorite as PrismaFavorite,
  Listing as PrismaListing,
  User as PrismaUser,
} from '../../../../generated/prisma/client';
import { Favorite } from '../../domain/entities/favorite';

export type PrismaFavoriteWithRelations = PrismaFavorite & {
  user: Pick<PrismaUser, 'id' | 'username' | 'displayName'>;
  listing: PrismaListing & {
    seller: Pick<PrismaUser, 'id' | 'username' | 'displayName'>;
    dimension: Pick<PrismaDimension, 'id' | 'slug' | 'name'>;
  };
};

export class PrismaFavoriteMapper {
  static toDomain(record: PrismaFavoriteWithRelations): Favorite {
    return Favorite.create({
      id: record.id,
      user: {
        id: record.user.id,
        username: record.user.username,
        displayName: record.user.displayName,
      },
      listing: {
        id: record.listing.id,
        slug: record.listing.slug,
        seller: {
          id: record.listing.seller.id,
          username: record.listing.seller.username,
          displayName: record.listing.seller.displayName,
        },
        dimension: {
          id: record.listing.dimension.id,
          slug: record.listing.dimension.slug,
          name: record.listing.dimension.name,
        },
        title: record.listing.title,
        description: record.listing.description,
        price: {
          amount: record.listing.price,
          currencyCode: record.listing.currencyCode,
        },
        rarity: record.listing.rarity,
        status: record.listing.status,
        imageUrls: record.listing.imageUrls,
        createdAt: record.listing.createdAt,
      },
      createdAt: record.createdAt,
    });
  }
}
