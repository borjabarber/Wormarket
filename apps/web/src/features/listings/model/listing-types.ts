import type { Rarity } from '../../../shared/components';

export const listingStatuses = [
  'DRAFT',
  'PUBLISHED',
  'RESERVED',
  'SOLD',
  'CANCELLED',
  'BLOCKED',
] as const;

export type ListingStatus = (typeof listingStatuses)[number];

export type ListingSeller = {
  displayName: string;
  id: string;
  username: string;
};

export type ListingDimension = {
  id: string;
  name: string;
  slug: string;
};

export type ListingPrice = {
  amount: number;
  currencyCode: string;
};

export type SaveListingInput = {
  description: string;
  dimensionSlug: string;
  imageUrls: string[];
  price: number;
  rarity: Rarity;
  title: string;
};

export type ListingSummary = {
  createdAt: string;
  description: string;
  dimension: ListingDimension;
  id: string;
  imageUrls: string[];
  price: ListingPrice;
  rarity: Rarity;
  seller: ListingSeller;
  slug: string;
  status: ListingStatus;
  title: string;
};
