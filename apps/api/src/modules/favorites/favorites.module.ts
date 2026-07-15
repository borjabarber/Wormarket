import { Module } from '@nestjs/common';

import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { TOKEN_SERVICE } from '../identity/application/ports/token-service';
import { HmacTokenService } from '../identity/infrastructure/crypto/hmac-token.service';
import { AddFavoriteUseCase } from './application/use-cases/add-favorite.use-case';
import { ListFavoritesUseCase } from './application/use-cases/list-favorites.use-case';
import { RemoveFavoriteUseCase } from './application/use-cases/remove-favorite.use-case';
import { FAVORITE_REPOSITORY } from './domain/repositories/favorite.repository';
import { PrismaFavoriteRepository } from './infrastructure/persistence/prisma-favorite.repository';
import { FavoritesController } from './presentation/favorites.controller';

@Module({
  controllers: [FavoritesController],
  providers: [
    PrismaService,
    ListFavoritesUseCase,
    AddFavoriteUseCase,
    RemoveFavoriteUseCase,
    {
      provide: FAVORITE_REPOSITORY,
      useClass: PrismaFavoriteRepository,
    },
    {
      provide: TOKEN_SERVICE,
      useClass: HmacTokenService,
    },
  ],
})
export class FavoritesModule {}
