import { describe, expect, it } from 'vitest';

import type { Review } from '../../domain/entities/review';
import type { ReviewRepository } from '../../domain/repositories/review.repository';
import { CreateReviewUseCase } from './create-review.use-case';

const review = {
  id: {
    toString: () => 'review-1',
  },
  transaction: {
    id: 'transaction-1',
    listing: {
      id: 'listing-1',
      slug: 'brujula-de-decisiones-no-tomadas',
      title: 'Brujula de decisiones no tomadas',
    },
    completedAt: new Date('2026-07-09T10:30:00.000Z'),
  },
  reviewer: {
    id: 'buyer-1',
    username: 'nadir-cronal',
    displayName: 'Nadir Cronal',
  },
  reviewee: {
    id: 'seller-1',
    username: 'lyra-oraculo',
    displayName: 'Lyra del Oraculo',
  },
  rating: 5,
  comment: 'Entrega impecable.',
  createdAt: new Date('2026-07-09T11:00:00.000Z'),
  updatedAt: new Date('2026-07-09T11:00:00.000Z'),
} as Review;

describe('CreateReviewUseCase', () => {
  it('creates reviews for the authenticated reviewer', async () => {
    let received: unknown = null;
    const repository: ReviewRepository = {
      create: async (input) => {
        received = input;
        return review;
      },
      findByRevieweeUsername: async () => [],
      calculateUserReputation: async () => 100,
    };
    const useCase = new CreateReviewUseCase(repository);

    await expect(
      useCase.execute('buyer-1', {
        transactionId: 'transaction-1',
        rating: 5,
        comment: 'Entrega impecable.',
      }),
    ).resolves.toMatchObject({
      id: 'review-1',
      rating: 5,
      reviewee: {
        username: 'lyra-oraculo',
      },
    });

    expect(received).toEqual({
      transactionId: 'transaction-1',
      reviewerId: 'buyer-1',
      rating: 5,
      comment: 'Entrega impecable.',
    });
  });
});
