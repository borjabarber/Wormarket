import type {
  Dimension as PrismaDimension,
  Listing as PrismaListing,
  User as PrismaUser,
} from '../../../../generated/prisma/client';
import { Listing } from '../../domain/entities/listing';

export type PrismaListingWithRelations = PrismaListing & {
  seller: Pick<PrismaUser, 'id' | 'username' | 'displayName'>;
  dimension: Pick<PrismaDimension, 'id' | 'slug' | 'name'>;
};

export class PrismaListingMapper {
  static toDomain(record: PrismaListingWithRelations): Listing {
    return Listing.create({
      id: record.id,
      slug: record.slug,
      seller: {
        id: record.seller.id,
        username: record.seller.username,
        displayName: record.seller.displayName,
      },
      dimension: {
        id: record.dimension.id,
        slug: record.dimension.slug,
        name: record.dimension.name,
      },
      title: record.title,
      description: record.description,
      price: record.price,
      currencyCode: record.currencyCode,
      rarity: record.rarity,
      status: record.status,
      imageUrls: record.imageUrls,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
