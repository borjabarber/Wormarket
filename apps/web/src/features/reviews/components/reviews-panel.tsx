'use client';

import { useQuery } from '@tanstack/react-query';

import { EmptyState, Skeleton } from '../../../shared/components';
import { reviewsClient } from '../api/reviews-client';
import { formatRating, formatReviewDate } from '../model/review-formatters';
import type { ReviewSummary } from '../model/review-types';

type ReviewsPanelProps = {
  username: string;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudieron cargar las valoraciones.';
}

function ReviewItem({ review }: { review: ReviewSummary }) {
  return (
    <li className="review-item">
      <article>
        <div className="review-item-header">
          <p className="review-rating">{formatRating(review.rating)}</p>
          <span>{formatReviewDate(review.createdAt)}</span>
        </div>
        <p className="review-item-title">{review.transaction.listing.title}</p>
        <p>
          Por <a href={`/users/${review.reviewer.username}`}>{review.reviewer.displayName}</a>
        </p>
        {review.comment ? <p className="review-comment">{review.comment}</p> : null}
      </article>
    </li>
  );
}

export function ReviewsPanel({ username }: ReviewsPanelProps) {
  const reviewsQuery = useQuery({
    queryFn: () => reviewsClient.listForUser(username),
    queryKey: ['reviews', 'user', username],
  });

  if (reviewsQuery.isPending) {
    return (
      <section className="reviews-panel" aria-busy="true" aria-label="Cargando valoraciones">
        <Skeleton label="Cargando valoraciones" />
        <Skeleton />
      </section>
    );
  }

  if (reviewsQuery.isError) {
    return (
      <section className="reviews-panel">
        <div className="explorer-error" role="alert">
          <h2>No se pudieron abrir las valoraciones</h2>
          <p>{getErrorMessage(reviewsQuery.error)}</p>
          <button
            className="wm-button wm-button-secondary"
            onClick={() => void reviewsQuery.refetch()}
          >
            Reintentar carga
          </button>
        </div>
      </section>
    );
  }

  const reviews = reviewsQuery.data;

  return (
    <section className="reviews-panel" aria-labelledby="reviews-title">
      <div>
        <p className="eyebrow">Valoraciones</p>
        <h2 id="reviews-title">Reputacion recibida</h2>
        <p className="reviews-summary" aria-live="polite">
          {reviews.length === 1
            ? '1 valoracion recibida'
            : `${reviews.length} valoraciones recibidas`}
        </p>
      </div>

      {reviews.length > 0 ? (
        <ul className="review-list" aria-label="Valoraciones recibidas">
          {reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </ul>
      ) : (
        <EmptyState title="Aun no hay valoraciones">
          Este perfil todavia no ha recibido valoraciones por transacciones completadas.
        </EmptyState>
      )}
    </section>
  );
}
