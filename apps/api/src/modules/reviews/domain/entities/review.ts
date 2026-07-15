import { ReviewId } from '../value-objects/review-id';

export type ReviewUser = {
  id: string;
  username: string;
  displayName: string;
};

export type ReviewListing = {
  id: string;
  slug: string;
  title: string;
};

export type ReviewTransaction = {
  id: string;
  listing: ReviewListing;
  completedAt: Date | null;
};

type ReviewProperties = {
  id: ReviewId;
  transaction: ReviewTransaction;
  reviewer: ReviewUser;
  reviewee: ReviewUser;
  rating: number;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type CreateReviewInput = Omit<ReviewProperties, 'id'> & {
  id: string;
};

export class Review {
  private constructor(private readonly properties: ReviewProperties) {}

  static create(input: CreateReviewInput): Review {
    if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
      throw new Error('Review rating must be an integer between 1 and 5.');
    }

    const normalizedComment = input.comment?.trim() ?? null;

    if (normalizedComment && normalizedComment.length > 1000) {
      throw new Error('Review comment cannot exceed 1000 characters.');
    }

    if (input.reviewer.id === input.reviewee.id) {
      throw new Error('Reviewer and reviewee must be different users.');
    }

    return new Review({
      ...input,
      id: ReviewId.create(input.id),
      transaction: {
        ...input.transaction,
        listing: { ...input.transaction.listing },
      },
      reviewer: { ...input.reviewer },
      reviewee: { ...input.reviewee },
      comment: normalizedComment,
    });
  }

  get id(): ReviewId {
    return this.properties.id;
  }

  get transaction(): ReviewTransaction {
    return {
      ...this.properties.transaction,
      listing: { ...this.properties.transaction.listing },
    };
  }

  get reviewer(): ReviewUser {
    return { ...this.properties.reviewer };
  }

  get reviewee(): ReviewUser {
    return { ...this.properties.reviewee };
  }

  get rating(): number {
    return this.properties.rating;
  }

  get comment(): string | null {
    return this.properties.comment;
  }

  get createdAt(): Date {
    return this.properties.createdAt;
  }

  get updatedAt(): Date {
    return this.properties.updatedAt;
  }
}
