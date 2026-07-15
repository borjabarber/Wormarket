import { describe, expect, it } from 'vitest';

import { Review } from './review';

const baseInput = {
  id: 'review-1',
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
  comment: 'Entrega impecable incluso con desfase temporal.',
  createdAt: new Date('2026-07-09T11:00:00.000Z'),
  updatedAt: new Date('2026-07-09T11:00:00.000Z'),
};

describe('Review', () => {
  it('creates valid reviews and trims comments', () => {
    const review = Review.create({
      ...baseInput,
      comment: '  Trato claro y portal estable.  ',
    });

    expect(review.id.toString()).toBe('review-1');
    expect(review.rating).toBe(5);
    expect(review.comment).toBe('Trato claro y portal estable.');
  });

  it('rejects ratings outside the accepted range', () => {
    expect(() =>
      Review.create({
        ...baseInput,
        rating: 6,
      }),
    ).toThrow('Review rating must be an integer between 1 and 5.');
  });

  it('rejects self reviews', () => {
    expect(() =>
      Review.create({
        ...baseInput,
        reviewee: baseInput.reviewer,
      }),
    ).toThrow('Reviewer and reviewee must be different users.');
  });
});
