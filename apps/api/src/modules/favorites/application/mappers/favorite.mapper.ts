import type { Favorite } from '../../domain/entities/favorite';
import type { FavoriteDto } from '../dto/favorite.dto';

export class FavoriteMapper {
  static toDto(favorite: Favorite): FavoriteDto {
    const listing = favorite.listing;

    return {
      id: favorite.id.toString(),
      user: favorite.user,
      listing: {
        ...listing,
        createdAt: listing.createdAt.toISOString(),
      },
      createdAt: favorite.createdAt.toISOString(),
    };
  }
}
