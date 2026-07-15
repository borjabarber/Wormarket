import type {
  Dimension as PrismaDimension,
  Listing as PrismaListing,
  Offer as PrismaOffer,
  User as PrismaUser,
} from '../../../../generated/prisma/client';
import { Offer } from '../../domain/entities/offer';

export type PrismaOfferWithRelations = PrismaOffer & {
  buyer: Pick<PrismaUser, 'id' | 'username' | 'displayName'>;
  listing: PrismaListing & {
    seller: Pick<PrismaUser, 'id' | 'username' | 'displayName'>;
    dimension: Pick<PrismaDimension, 'id' | 'slug' | 'name'>;
  };
};

export class PrismaOfferMapper {
  static toDomain(record: PrismaOfferWithRelations): Offer {
    return Offer.create({
      id: record.id,
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
        price: {
          amount: record.listing.price,
          currencyCode: record.listing.currencyCode,
        },
        rarity: record.listing.rarity,
        status: record.listing.status,
      },
      buyer: {
        id: record.buyer.id,
        username: record.buyer.username,
        displayName: record.buyer.displayName,
      },
      amount: record.amount,
      currencyCode: record.currencyCode,
      message: record.message,
      status: record.status,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
