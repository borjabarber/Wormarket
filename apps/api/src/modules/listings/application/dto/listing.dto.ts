import type { ListingRarity, ListingStatus } from '../../domain/entities/listing';

export type ListingSellerDto = {
  id: string;
  username: string;
  displayName: string;
};

export type ListingDimensionDto = {
  id: string;
  slug: string;
  name: string;
};

export type ListingPriceDto = {
  amount: number;
  currencyCode: string;
};

export type ListingDto = {
  id: string;
  slug: string;
  seller: ListingSellerDto;
  dimension: ListingDimensionDto;
  title: string;
  description: string;
  price: ListingPriceDto;
  rarity: ListingRarity;
  status: ListingStatus;
  imageUrls: string[];
  createdAt: string;
};
