import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { IdentityError } from '../../identity/application/errors/identity-error';
import { TOKEN_SERVICE, type TokenService } from '../../identity/application/ports/token-service';
import type { ListingRarity } from '../domain/entities/listing';
import { listingRarities } from '../domain/entities/listing';
import type { CreateListingDto } from '../application/dto/create-listing.dto';
import type { ListingDto } from '../application/dto/listing.dto';
import type { UpdateListingDto } from '../application/dto/update-listing.dto';
import { ListingError } from '../application/errors/listing-error';
import { CreateListingUseCase } from '../application/use-cases/create-listing.use-case';
import { GetListingUseCase } from '../application/use-cases/get-listing.use-case';
import { ListListingsUseCase } from '../application/use-cases/list-listings.use-case';
import { UpdateListingUseCase } from '../application/use-cases/update-listing.use-case';

@Controller('listings')
export class ListingsController {
  constructor(
    @Inject(ListListingsUseCase)
    private readonly listListingsUseCase: ListListingsUseCase,
    @Inject(GetListingUseCase)
    private readonly getListingUseCase: GetListingUseCase,
    @Inject(CreateListingUseCase)
    private readonly createListingUseCase: CreateListingUseCase,
    @Inject(UpdateListingUseCase)
    private readonly updateListingUseCase: UpdateListingUseCase,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
  ) {}

  @Get()
  async listListings(): Promise<ListingDto[]> {
    return this.mapListingErrors(() => this.listListingsUseCase.execute());
  }

  @Get(':slug')
  async getListing(@Param('slug') slug: string): Promise<ListingDto> {
    return this.mapListingErrors(async () => {
      const listing = await this.getListingUseCase.execute(slug);

      if (!listing) {
        throw new ListingError('LISTING_NOT_FOUND', 'El anuncio no existe.', 404);
      }

      return listing;
    });
  }

  @Post()
  async createListing(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: unknown,
  ): Promise<ListingDto> {
    return this.mapListingErrors(() => {
      const seller = this.tokenService.verify(this.parseBearerToken(authorization), 'access');

      return this.createListingUseCase.execute(seller.sub, this.parseCreateListingBody(body));
    });
  }

  @Patch(':slug')
  async updateListing(
    @Headers('authorization') authorization: string | undefined,
    @Param('slug') slug: string,
    @Body() body: unknown,
  ): Promise<ListingDto> {
    return this.mapListingErrors(() => {
      const seller = this.tokenService.verify(this.parseBearerToken(authorization), 'access');

      return this.updateListingUseCase.execute(slug, seller.sub, this.parseUpdateListingBody(body));
    });
  }

  private parseCreateListingBody(body: unknown): CreateListingDto {
    if (!this.isRecord(body)) {
      throw this.invalidBodyError();
    }

    const { dimensionSlug, title, description, price, rarity, imageUrls } = body;

    if (
      typeof dimensionSlug !== 'string' ||
      typeof title !== 'string' ||
      typeof description !== 'string' ||
      typeof price !== 'number' ||
      !this.isListingRarity(rarity) ||
      !Array.isArray(imageUrls) ||
      !imageUrls.every((imageUrl) => typeof imageUrl === 'string')
    ) {
      throw this.invalidBodyError();
    }

    if (imageUrls.length > 8) {
      throw this.invalidBodyError();
    }

    return {
      dimensionSlug,
      title,
      description,
      price,
      rarity,
      imageUrls,
    };
  }

  private parseUpdateListingBody(body: unknown): UpdateListingDto {
    return this.parseCreateListingBody(body);
  }

  private parseBearerToken(authorization: string | undefined): string {
    if (!authorization?.startsWith('Bearer ')) {
      throw new ListingError(
        'INVALID_AUTHORIZATION_HEADER',
        'La cabecera de autorizacion no es valida.',
        401,
      );
    }

    return authorization.slice('Bearer '.length).trim();
  }

  private async mapListingErrors<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error: unknown) {
      if (error instanceof ListingError) {
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

  private invalidBodyError(): ListingError {
    return new ListingError('INVALID_LISTING_BODY', 'La solicitud no es valida.', 400);
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
  }

  private isListingRarity(value: unknown): value is ListingRarity {
    return listingRarities.some((rarity) => rarity === value);
  }
}
