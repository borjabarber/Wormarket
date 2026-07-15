import type { ListingRarity } from '../../domain/entities/listing';

export type CreateListingDto = {
  dimensionSlug: string;
  title: string;
  description: string;
  price: number;
  rarity: ListingRarity;
  imageUrls: string[];
};
