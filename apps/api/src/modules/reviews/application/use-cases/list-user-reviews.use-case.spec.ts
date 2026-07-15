import { describe, expect, it } from 'vitest';

import type { Review } from '../../domain/entities/review';
import type { ReviewRepository } from '../../domain/repositories/review.repository';
import { ListUserReviewsUseCase } from './list-user-reviews.use-case';

describe('ListUserReviewsUseCase', () => {
  it('returns reviews for the requested public username', async () => {
    const repository: ReviewRepository = {
      create: async () => {
        throw new Error('Not used in this test.');
      },
      findByRevieweeUsername: async (username) => {
        expect(username).toBe('lyra-oraculo');

        return [
          {
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
            comment: null,
            createdAt: new Date('2026-07-09T11:00:00.000Z'),
            updatedAt: new Date('2026-07-09T11:00:00.000Z'),
          } as Review,
        ];
      },
      calculateUserReputation: async () => 100,
    };
    const useCase = new ListUserReviewsUseCase(repository);

    await expect(useCase.execute('lyra-oraculo')).resolves.toHaveLength(1);
  });
});
