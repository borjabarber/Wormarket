import { Module } from '@nestjs/common';

import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { TOKEN_SERVICE } from '../identity/application/ports/token-service';
import { HmacTokenService } from '../identity/infrastructure/crypto/hmac-token.service';
import { BlockListingUseCase } from './application/use-cases/block-listing.use-case';
import { BlockUserUseCase } from './application/use-cases/block-user.use-case';
import { ListReportsUseCase } from './application/use-cases/list-reports.use-case';
import { ReportListingUseCase } from './application/use-cases/report-listing.use-case';
import { ReportUserUseCase } from './application/use-cases/report-user.use-case';
import { ResolveReportUseCase } from './application/use-cases/resolve-report.use-case';
import { MODERATION_REPOSITORY } from './domain/repositories/moderation.repository';
import { PrismaModerationRepository } from './infrastructure/persistence/prisma-moderation.repository';
import { ModerationController } from './presentation/moderation.controller';

@Module({
  controllers: [ModerationController],
  providers: [
    PrismaService,
    ReportListingUseCase,
    ReportUserUseCase,
    ListReportsUseCase,
    ResolveReportUseCase,
    BlockListingUseCase,
    BlockUserUseCase,
    {
      provide: MODERATION_REPOSITORY,
      useClass: PrismaModerationRepository,
    },
    {
      provide: TOKEN_SERVICE,
      useClass: HmacTokenService,
    },
  ],
})
export class ModerationModule {}
