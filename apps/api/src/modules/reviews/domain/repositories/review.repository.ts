import type { Review } from '../entities/review';

export const REVIEW_REPOSITORY = Symbol('REVIEW_REPOSITORY');

export type CreateReviewInput = {
  transactionId: string;
  reviewerId: string;
  rating: number;
  comment?: string | null;
};

export interface ReviewRepository {
  create(input: CreateReviewInput): Promise<Review>;
  findByRevieweeUsername(username: string): Promise<Review[]>;
  calculateUserReputation(userId: string): Promise<number>;
}
