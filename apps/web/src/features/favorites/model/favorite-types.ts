import type { ListingSummary } from '../../listings/model/listing-types';

export type FavoriteUser = {
  displayName: string;
  id: string;
  username: string;
};

export type FavoriteSummary = {
  createdAt: string;
  id: string;
  listing: ListingSummary;
  user: FavoriteUser;
};
