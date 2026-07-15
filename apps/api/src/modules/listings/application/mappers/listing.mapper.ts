import type { Listing } from '../../domain/entities/listing';
import type { ListingDto } from '../dto/listing.dto';

export class ListingMapper {
  static toDto(listing: Listing): ListingDto {
    return {
      id: listing.id.toString(),
      slug: listing.slug,
      seller: listing.seller,
      dimension: listing.dimension,
      title: listing.title,
      description: listing.description,
      price: {
        amount: listing.price.amount,
        currencyCode: listing.price.currencyCode,
      },
      rarity: listing.rarity,
      status: listing.status,
      imageUrls: listing.imageUrls,
      createdAt: listing.createdAt.toISOString(),
    };
  }
}
