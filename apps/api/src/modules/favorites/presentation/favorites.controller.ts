import {
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpException,
  Inject,
  Param,
  Post,
} from '@nestjs/common';

import { IdentityError } from '../../identity/application/errors/identity-error';
import { TOKEN_SERVICE, type TokenService } from '../../identity/application/ports/token-service';
import type { FavoriteDto } from '../application/dto/favorite.dto';
import { FavoriteError } from '../application/errors/favorite-error';
import { AddFavoriteUseCase } from '../application/use-cases/add-favorite.use-case';
import { ListFavoritesUseCase } from '../application/use-cases/list-favorites.use-case';
import { RemoveFavoriteUseCase } from '../application/use-cases/remove-favorite.use-case';

@Controller('favorites')
export class FavoritesController {
  constructor(
    @Inject(ListFavoritesUseCase)
    private readonly listFavoritesUseCase: ListFavoritesUseCase,
    @Inject(AddFavoriteUseCase)
    private readonly addFavoriteUseCase: AddFavoriteUseCase,
    @Inject(RemoveFavoriteUseCase)
    private readonly removeFavoriteUseCase: RemoveFavoriteUseCase,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
  ) {}

  @Get()
  async listFavorites(
    @Headers('authorization') authorization: string | undefined,
  ): Promise<FavoriteDto[]> {
    return this.mapFavoriteErrors(() => {
      const user = this.tokenService.verify(this.parseBearerToken(authorization), 'access');

      return this.listFavoritesUseCase.execute(user.sub);
    });
  }

  @Post(':listingSlug')
  async addFavorite(
    @Headers('authorization') authorization: string | undefined,
    @Param('listingSlug') listingSlug: string,
  ): Promise<FavoriteDto> {
    return this.mapFavoriteErrors(() => {
      const user = this.tokenService.verify(this.parseBearerToken(authorization), 'access');

      return this.addFavoriteUseCase.execute(user.sub, listingSlug);
    });
  }

  @Delete(':listingSlug')
  @HttpCode(204)
  async removeFavorite(
    @Headers('authorization') authorization: string | undefined,
    @Param('listingSlug') listingSlug: string,
  ): Promise<void> {
    return this.mapFavoriteErrors(() => {
      const user = this.tokenService.verify(this.parseBearerToken(authorization), 'access');

      return this.removeFavoriteUseCase.execute(user.sub, listingSlug);
    });
  }

  private parseBearerToken(authorization: string | undefined): string {
    if (!authorization?.startsWith('Bearer ')) {
      throw new FavoriteError(
        'INVALID_AUTHORIZATION_HEADER',
        'La cabecera de autorizacion no es valida.',
        401,
      );
    }

    return authorization.slice('Bearer '.length).trim();
  }

  private async mapFavoriteErrors<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error: unknown) {
      if (error instanceof FavoriteError) {
        throw new HttpException(
          {
            code: error.code,
            message: error.message,
          },
          error.statusCode,
        );
      }

      if (error instanceof IdentityError) {
        throw new HttpException(
          {
            code: error.code,
            message: error.message,
          },
          error.statusCode,
        );
      }

      throw error;
    }
  }
}
