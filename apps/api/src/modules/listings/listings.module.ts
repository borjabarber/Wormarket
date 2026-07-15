import { Module } from '@nestjs/common';

import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { TOKEN_SERVICE } from '../identity/application/ports/token-service';
import { HmacTokenService } from '../identity/infrastructure/crypto/hmac-token.service';
import { CreateListingUseCase } from './application/use-cases/create-listing.use-case';
import { GetListingUseCase } from './application/use-cases/get-listing.use-case';
import { ListListingsUseCase } from './application/use-cases/list-listings.use-case';
import { UpdateListingUseCase } from './application/use-cases/update-listing.use-case';
import { LISTING_REPOSITORY } from './domain/repositories/listing.repository';
import { PrismaListingRepository } from './infrastructure/persistence/prisma-listing.repository';
import { ListingsController } from './presentation/listings.controller';

@Module({
  controllers: [ListingsController],
  providers: [
    PrismaService,
    ListListingsUseCase,
    GetListingUseCase,
    CreateListingUseCase,
    UpdateListingUseCase,
    {
      provide: LISTING_REPOSITORY,
      useClass: PrismaListingRepository,
    },
    {
      provide: TOKEN_SERVICE,
      useClass: HmacTokenService,
    },
  ],
})
export class ListingsModule {}
