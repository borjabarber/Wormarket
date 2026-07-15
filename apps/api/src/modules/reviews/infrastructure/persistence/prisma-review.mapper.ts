import type {
  Listing as PrismaListing,
  Review as PrismaReview,
  Transaction as PrismaTransaction,
  User as PrismaUser,
} from '../../../../generated/prisma/client';
import { Review } from '../../domain/entities/review';

export type PrismaReviewWithRelations = PrismaReview & {
  reviewer: Pick<PrismaUser, 'id' | 'username' | 'displayName'>;
  reviewee: Pick<PrismaUser, 'id' | 'username' | 'displayName'>;
  transaction: Pick<PrismaTransaction, 'id' | 'completedAt'> & {
    listing: Pick<PrismaListing, 'id' | 'slug' | 'title'>;
  };
};

export class PrismaReviewMapper {
  static toDomain(record: PrismaReviewWithRelations): Review {
    return Review.create({
      id: record.id,
      transaction: {
        id: record.transaction.id,
        listing: {
          id: record.transaction.listing.id,
          slug: record.transaction.listing.slug,
          title: record.transaction.listing.title,
        },
        completedAt: record.transaction.completedAt,
      },
      reviewer: {
        id: record.reviewer.id,
        username: record.reviewer.username,
        displayName: record.reviewer.displayName,
      },
      reviewee: {
        id: record.reviewee.id,
        username: record.reviewee.username,
        displayName: record.reviewee.displayName,
      },
      rating: record.rating,
      comment: record.comment,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
