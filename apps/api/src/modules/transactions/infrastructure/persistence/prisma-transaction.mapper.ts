import type {
  Dimension as PrismaDimension,
  Listing as PrismaListing,
  Transaction as PrismaTransaction,
  User as PrismaUser,
} from '../../../../generated/prisma/client';
import { Transaction } from '../../domain/entities/transaction';

export type PrismaTransactionWithRelations = PrismaTransaction & {
  buyer: Pick<PrismaUser, 'id' | 'username' | 'displayName'>;
  seller: Pick<PrismaUser, 'id' | 'username' | 'displayName'>;
  listing: PrismaListing & {
    seller: Pick<PrismaUser, 'id' | 'username' | 'displayName'>;
    dimension: Pick<PrismaDimension, 'id' | 'slug' | 'name'>;
  };
};

export class PrismaTransactionMapper {
  static toDomain(record: PrismaTransactionWithRelations): Transaction {
    return Transaction.create({
      id: record.id,
      offerId: record.offerId,
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
      seller: {
        id: record.seller.id,
        username: record.seller.username,
        displayName: record.seller.displayName,
      },
      amount: record.amount,
      currencyCode: record.currencyCode,
      status: record.status,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      completedAt: record.completedAt,
    });
  }
}
