import { Module } from '@nestjs/common';

import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { TOKEN_SERVICE } from '../identity/application/ports/token-service';
import { HmacTokenService } from '../identity/infrastructure/crypto/hmac-token.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { CreateReviewUseCase } from './application/use-cases/create-review.use-case';
import { ListUserReviewsUseCase } from './application/use-cases/list-user-reviews.use-case';
import { REVIEW_REPOSITORY } from './domain/repositories/review.repository';
import { PrismaReviewRepository } from './infrastructure/persistence/prisma-review.repository';
import { ReviewsController } from './presentation/reviews.controller';

@Module({
  imports: [NotificationsModule],
  controllers: [ReviewsController],
  providers: [
    PrismaService,
    CreateReviewUseCase,
    ListUserReviewsUseCase,
    {
      provide: REVIEW_REPOSITORY,
      useClass: PrismaReviewRepository,
    },
    {
      provide: TOKEN_SERVICE,
      useClass: HmacTokenService,
    },
  ],
})
export class ReviewsModule {}
