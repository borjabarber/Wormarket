import type { ListingRarity } from '../../domain/entities/listing';

export type UpdateListingDto = {
  dimensionSlug: string;
  title: string;
  description: string;
  price: number;
  rarity: ListingRarity;
  imageUrls: string[];
};
