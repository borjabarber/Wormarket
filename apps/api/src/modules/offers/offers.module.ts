import { Module } from '@nestjs/common';

import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { TOKEN_SERVICE } from '../identity/application/ports/token-service';
import { HmacTokenService } from '../identity/infrastructure/crypto/hmac-token.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { AcceptOfferUseCase } from './application/use-cases/accept-offer.use-case';
import { CancelOfferUseCase } from './application/use-cases/cancel-offer.use-case';
import { CreateOfferUseCase } from './application/use-cases/create-offer.use-case';
import { ListListingOffersUseCase } from './application/use-cases/list-listing-offers.use-case';
import { ListMyOffersUseCase } from './application/use-cases/list-my-offers.use-case';
import { RejectOfferUseCase } from './application/use-cases/reject-offer.use-case';
import { OFFER_REPOSITORY } from './domain/repositories/offer.repository';
import { PrismaOfferRepository } from './infrastructure/persistence/prisma-offer.repository';
import { OffersController } from './presentation/offers.controller';

@Module({
  imports: [NotificationsModule],
  controllers: [OffersController],
  providers: [
    PrismaService,
    CreateOfferUseCase,
    ListMyOffersUseCase,
    ListListingOffersUseCase,
    AcceptOfferUseCase,
    RejectOfferUseCase,
    CancelOfferUseCase,
    {
      provide: OFFER_REPOSITORY,
      useClass: PrismaOfferRepository,
    },
    {
      provide: TOKEN_SERVICE,
      useClass: HmacTokenService,
    },
  ],
})
export class OffersModule {}
