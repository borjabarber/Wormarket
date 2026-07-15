import type { Rarity } from '../../../shared/components';
import type { ListingStatus } from '../../listings/model/listing-types';

export const transactionStatuses = ['PENDING_DELIVERY', 'COMPLETED', 'CANCELLED'] as const;

export type TransactionStatus = (typeof transactionStatuses)[number];

export type TransactionUser = {
  displayName: string;
  id: string;
  username: string;
};

export type TransactionSummary = {
  amount: {
    amount: number;
    currencyCode: string;
  };
  buyer: TransactionUser;
  completedAt: string | null;
  createdAt: string;
  id: string;
  listing: {
    dimension: {
      id: string;
      name: string;
      slug: string;
    };
    id: string;
    price: {
      amount: number;
      currencyCode: string;
    };
    rarity: Rarity;
    seller: TransactionUser;
    slug: string;
    status: ListingStatus;
    title: string;
  };
  offerId: string;
  seller: TransactionUser;
  status: TransactionStatus;
  updatedAt: string;
};
