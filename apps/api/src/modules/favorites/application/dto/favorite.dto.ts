import type { ListingRarity, ListingStatus } from '../../../listings/domain/entities/listing';

export type FavoriteUserDto = {
  id: string;
  username: string;
  displayName: string;
};

export type FavoriteListingDto = {
  id: string;
  slug: string;
  seller: FavoriteUserDto;
  dimension: {
    id: string;
    slug: string;
    name: string;
  };
  title: string;
  description: string;
  price: {
    amount: number;
    currencyCode: string;
  };
  rarity: ListingRarity;
  status: ListingStatus;
  imageUrls: string[];
  createdAt: string;
};

export type FavoriteDto = {
  id: string;
  user: FavoriteUserDto;
  listing: FavoriteListingDto;
  createdAt: string;
};
