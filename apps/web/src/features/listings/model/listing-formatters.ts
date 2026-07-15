import type { Rarity } from '../../../shared/components';
import type { ListingStatus, ListingSummary } from './listing-types';

export const rarityLabels: Record<Rarity, string> = {
  COMMON: 'Comun',
  EPIC: 'Epico',
  FORBIDDEN: 'Prohibido',
  LEGENDARY: 'Legendario',
  RARE: 'Raro',
};

export const statusLabels: Record<ListingStatus, string> = {
  BLOCKED: 'Bloqueado',
  CANCELLED: 'Cancelado',
  DRAFT: 'Borrador',
  PUBLISHED: 'Publicado',
  RESERVED: 'Reservado',
  SOLD: 'Vendido',
};

export function formatListingPrice(listing: ListingSummary): string {
  return `${listing.price.amount} ${listing.price.currencyCode}`;
}

export function formatListingDate(value: string): string {
  return new Intl.DateTimeFormat('es', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}
