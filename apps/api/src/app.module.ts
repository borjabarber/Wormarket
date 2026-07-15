import { Module } from '@nestjs/common';

import { HealthModule } from './health/health.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { DimensionsModule } from './modules/dimensions/dimensions.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { IdentityModule } from './modules/identity/identity.module';
import { ListingsModule } from './modules/listings/listings.module';
import { ModerationModule } from './modules/moderation/moderation.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { OffersModule } from './modules/offers/offers.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { StorageModule } from './modules/storage/storage.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    HealthModule,
    DimensionsModule,
    UsersModule,
    IdentityModule,
    ListingsModule,
    FavoritesModule,
    OffersModule,
    TransactionsModule,
    ConversationsModule,
    ReviewsModule,
    NotificationsModule,
    ModerationModule,
    StorageModule,
  ],
})
export class AppModule {}
