import type {
  ListingDimension,
  ListingPrice,
  ListingSeller,
  ListingStatus,
} from '../../listings/model/listing-types';
import type { Rarity } from '../../../shared/components';

export const offerStatuses = ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'] as const;

export type OfferStatus = (typeof offerStatuses)[number];

export type OfferUser = {
  displayName: string;
  id: string;
  username: string;
};

export type OfferListing = {
  dimension: ListingDimension;
  id: string;
  price: ListingPrice;
  rarity: Rarity;
  seller: ListingSeller;
  slug: string;
  status: ListingStatus;
  title: string;
};

export type OfferAmount = {
  amount: number;
  currencyCode: string;
};

export type OfferSummary = {
  amount: OfferAmount;
  buyer: OfferUser;
  createdAt: string;
  id: string;
  listing: OfferListing;
  message: string | null;
  status: OfferStatus;
  updatedAt: string;
};

export type CreateOfferInput = {
  amount: number;
  listingSlug: string;
  message: string | null;
};
