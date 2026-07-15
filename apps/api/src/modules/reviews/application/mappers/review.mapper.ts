import type { Review } from '../../domain/entities/review';
import type { ReviewDto } from '../dto/review.dto';

export class ReviewMapper {
  static toDto(review: Review): ReviewDto {
    return {
      id: review.id.toString(),
      transaction: {
        id: review.transaction.id,
        listing: review.transaction.listing,
        completedAt: review.transaction.completedAt?.toISOString() ?? null,
      },
      reviewer: review.reviewer,
      reviewee: review.reviewee,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
    };
  }
}
