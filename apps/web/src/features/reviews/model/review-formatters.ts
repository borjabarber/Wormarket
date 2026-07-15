export function formatRating(rating: number): string {
  return rating === 1 ? '1 estrella' : `${rating} estrellas`;
}

export function formatReviewDate(value: string): string {
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
  }).format(new Date(value));
}
