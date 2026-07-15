import type { ListingRarity, ListingStatus } from '../../../listings/domain/entities/listing';
import type { TransactionStatus } from '../../domain/entities/transaction';

export type TransactionUserDto = {
  id: string;
  username: string;
  displayName: string;
};

export type TransactionListingDto = {
  id: string;
  slug: string;
  seller: TransactionUserDto;
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

export type TransactionDto = {
  id: string;
  offerId: string;
  listing: TransactionListingDto;
  buyer: TransactionUserDto;
  seller: TransactionUserDto;
  amount: {
    amount: number;
    currencyCode: string;
  };
  status: TransactionStatus;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};
