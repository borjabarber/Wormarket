import { Body, Controller, Get, Headers, HttpException, Inject, Param, Post } from '@nestjs/common';

import { IdentityError } from '../../identity/application/errors/identity-error';
import { TOKEN_SERVICE, type TokenService } from '../../identity/application/ports/token-service';
import type { CreateOfferDto } from '../application/dto/create-offer.dto';
import type { OfferDto } from '../application/dto/offer.dto';
import { OfferError } from '../application/errors/offer-error';
import { AcceptOfferUseCase } from '../application/use-cases/accept-offer.use-case';
import { CancelOfferUseCase } from '../application/use-cases/cancel-offer.use-case';
import { CreateOfferUseCase } from '../application/use-cases/create-offer.use-case';
import { ListListingOffersUseCase } from '../application/use-cases/list-listing-offers.use-case';
import { ListMyOffersUseCase } from '../application/use-cases/list-my-offers.use-case';
import { RejectOfferUseCase } from '../application/use-cases/reject-offer.use-case';

@Controller()
export class OffersController {
  constructor(
    @Inject(CreateOfferUseCase)
    private readonly createOfferUseCase: CreateOfferUseCase,
    @Inject(ListMyOffersUseCase)
    private readonly listMyOffersUseCase: ListMyOffersUseCase,
    @Inject(ListListingOffersUseCase)
    private readonly listListingOffersUseCase: ListListingOffersUseCase,
    @Inject(AcceptOfferUseCase)
    private readonly acceptOfferUseCase: AcceptOfferUseCase,
    @Inject(RejectOfferUseCase)
    private readonly rejectOfferUseCase: RejectOfferUseCase,
    @Inject(CancelOfferUseCase)
    private readonly cancelOfferUseCase: CancelOfferUseCase,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
  ) {}

  @Post('offers')
  async createOffer(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: unknown,
  ): Promise<OfferDto> {
    return this.mapOfferErrors(() => {
      const buyer = this.tokenService.verify(this.parseBearerToken(authorization), 'access');

      return this.createOfferUseCase.execute(buyer.sub, this.parseCreateOfferBody(body));
    });
  }

  @Get('offers')
  async listMyOffers(
    @Headers('authorization') authorization: string | undefined,
  ): Promise<OfferDto[]> {
    return this.mapOfferErrors(() => {
      const buyer = this.tokenService.verify(this.parseBearerToken(authorization), 'access');

      return this.listMyOffersUseCase.execute(buyer.sub);
    });
  }

  @Get('listings/:listingSlug/offers')
  async listListingOffers(
    @Headers('authorization') authorization: string | undefined,
    @Param('listingSlug') listingSlug: string,
  ): Promise<OfferDto[]> {
    return this.mapOfferErrors(() => {
      const seller = this.tokenService.verify(this.parseBearerToken(authorization), 'access');

      return this.listListingOffersUseCase.execute(seller.sub, listingSlug);
    });
  }

  @Post('offers/:offerId/accept')
  async acceptOffer(
    @Headers('authorization') authorization: string | undefined,
    @Param('offerId') offerId: string,
  ): Promise<OfferDto> {
    return this.mapOfferErrors(() => {
      const seller = this.tokenService.verify(this.parseBearerToken(authorization), 'access');

      return this.acceptOfferUseCase.execute(seller.sub, offerId);
    });
  }

  @Post('offers/:offerId/reject')
  async rejectOffer(
    @Headers('authorization') authorization: string | undefined,
    @Param('offerId') offerId: string,
  ): Promise<OfferDto> {
    return this.mapOfferErrors(() => {
      const seller = this.tokenService.verify(this.parseBearerToken(authorization), 'access');

      return this.rejectOfferUseCase.execute(seller.sub, offerId);
    });
  }

  @Post('offers/:offerId/cancel')
  async cancelOffer(
    @Headers('authorization') authorization: string | undefined,
    @Param('offerId') offerId: string,
  ): Promise<OfferDto> {
    return this.mapOfferErrors(() => {
      const buyer = this.tokenService.verify(this.parseBearerToken(authorization), 'access');

      return this.cancelOfferUseCase.execute(buyer.sub, offerId);
    });
  }

  private parseCreateOfferBody(body: unknown): CreateOfferDto {
    if (!this.isRecord(body)) {
      throw this.invalidBodyError();
    }

    const { listingSlug, amount, message } = body;

    if (
      typeof listingSlug !== 'string' ||
      typeof amount !== 'number' ||
      (message !== null && message !== undefined && typeof message !== 'string')
    ) {
      throw this.invalidBodyError();
    }

    return {
      listingSlug,
      amount,
      message: message ?? null,
    };
  }

  private parseBearerToken(authorization: string | undefined): string {
    if (!authorization?.startsWith('Bearer ')) {
      throw new OfferError(
        'INVALID_AUTHORIZATION_HEADER',
        'La cabecera de autorizacion no es valida.',
        401,
      );
    }

    return authorization.slice('Bearer '.length).trim();
  }

  private async mapOfferErrors<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error: unknown) {
      if (error instanceof OfferError) {
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

  private invalidBodyError(): OfferError {
    return new OfferError('INVALID_OFFER_BODY', 'La solicitud no es valida.', 400);
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
  }
}
