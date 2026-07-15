import { Inject, Injectable } from '@nestjs/common';

import {
  FAVORITE_REPOSITORY,
  type FavoriteRepository,
} from '../../domain/repositories/favorite.repository';
import type { FavoriteDto } from '../dto/favorite.dto';
import { FavoriteMapper } from '../mappers/favorite.mapper';

@Injectable()
export class ListFavoritesUseCase {
  constructor(
    @Inject(FAVORITE_REPOSITORY) private readonly favoriteRepository: FavoriteRepository,
  ) {}

  async execute(userId: string): Promise<FavoriteDto[]> {
    const favorites = await this.favoriteRepository.findByUserId(userId);

    return favorites.map((favorite) => FavoriteMapper.toDto(favorite));
  }
}
