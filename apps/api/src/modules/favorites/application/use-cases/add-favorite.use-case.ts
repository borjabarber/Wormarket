import { Inject, Injectable } from '@nestjs/common';

import {
  FAVORITE_REPOSITORY,
  type FavoriteRepository,
} from '../../domain/repositories/favorite.repository';
import type { FavoriteDto } from '../dto/favorite.dto';
import { FavoriteMapper } from '../mappers/favorite.mapper';

@Injectable()
export class AddFavoriteUseCase {
  constructor(
    @Inject(FAVORITE_REPOSITORY) private readonly favoriteRepository: FavoriteRepository,
  ) {}

  async execute(userId: string, listingSlug: string): Promise<FavoriteDto> {
    const favorite = await this.favoriteRepository.add(userId, listingSlug);

    return FavoriteMapper.toDto(favorite);
  }
}
