import type { OfferAmount, OfferStatus } from './offer-types';

export const offerStatusLabels: Record<OfferStatus, string> = {
  ACCEPTED: 'Aceptada',
  CANCELLED: 'Cancelada',
  PENDING: 'Pendiente',
  REJECTED: 'Rechazada',
};

export function formatOfferAmount(amount: OfferAmount): string {
  return `${amount.amount} ${amount.currencyCode}`;
}

export function formatOfferDate(value: string): string {
  return new Intl.DateTimeFormat('es', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}
