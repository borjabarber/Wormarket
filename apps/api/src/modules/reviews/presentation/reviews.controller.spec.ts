import { HttpException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';

import type {
  AuthTokenPayload,
  TokenService,
} from '../../identity/application/ports/token-service';
import type { ReviewDto } from '../application/dto/review.dto';
import { ReviewsController } from './reviews.controller';

const review: ReviewDto = {
  id: 'review-1',
  transaction: {
    id: 'transaction-1',
    listing: {
      id: 'listing-1',
      slug: 'brujula-de-decisiones-no-tomadas',
      title: 'Brujula de decisiones no tomadas',
    },
    completedAt: '2026-07-09T10:30:00.000Z',
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
  createdAt: '2026-07-09T11:00:00.000Z',
  updatedAt: '2026-07-09T11:00:00.000Z',
};

const tokenPayload: AuthTokenPayload = {
  sub: 'buyer-1',
  username: 'nadir-cronal',
  role: 'USER',
  kind: 'access',
};

const tokenService: TokenService = {
  issueAccessToken: () => 'access-token',
  issueRefreshToken: () => 'refresh-token',
  verify: () => tokenPayload,
  hashRefreshToken: () => 'refresh-token-hash',
};

describe('ReviewsController', () => {
  it('creates reviews using the authenticated reviewer id', async () => {
    let received: { reviewerId: string; transactionId: string; rating: number } | null = null;
    const controller = new ReviewsController(
      {
        execute: async (reviewerId, input) => {
          received = {
            reviewerId,
            transactionId: input.transactionId,
            rating: input.rating,
          };
          return review;
        },
      },
      {
        execute: async () => [],
      },
      tokenService,
    );

    await expect(
      controller.createReview('Bearer access-token', {
        transactionId: 'transaction-1',
        rating: 5,
      }),
    ).resolves.toEqual(review);

    expect(received).toEqual({
      reviewerId: 'buyer-1',
      transactionId: 'transaction-1',
      rating: 5,
    });
  });

  it('lists public reviews without authentication', async () => {
    const controller = new ReviewsController(
      {
        execute: async () => review,
      },
      {
        execute: async (username) => {
          expect(username).toBe('lyra-oraculo');
          return [review];
        },
      },
      tokenService,
    );

    await expect(controller.listUserReviews('lyra-oraculo')).resolves.toEqual([review]);
  });

  it('rejects review creation without authorization', async () => {
    const controller = new ReviewsController(
      {
        execute: async () => review,
      },
      {
        execute: async () => [],
      },
      tokenService,
    );

    await expect(
      controller.createReview(undefined, {
        transactionId: 'transaction-1',
        rating: 5,
      }),
    ).rejects.toBeInstanceOf(HttpException);
  });
});
