import type { ListingRarity, ListingStatus } from '../../../listings/domain/entities/listing';
import type { OfferStatus } from '../../domain/entities/offer';

export type OfferUserDto = {
  id: string;
  username: string;
  displayName: string;
};

export type OfferListingDto = {
  id: string;
  slug: string;
  seller: OfferUserDto;
  dimension: {
    id: string;
    slug: string;
    name: string;
  };
  title: string;
  price: {
    amount: number;
    currencyCode: string;
  };
  rarity: ListingRarity;
  status: ListingStatus;
};

export type OfferDto = {
  id: string;
  listing: OfferListingDto;
  buyer: OfferUserDto;
  amount: {
    amount: number;
    currencyCode: string;
  };
  message: string | null;
  status: OfferStatus;
  createdAt: string;
  updatedAt: string;
};
