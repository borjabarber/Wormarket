import { Module } from '@nestjs/common';

import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { TOKEN_SERVICE } from '../identity/application/ports/token-service';
import { HmacTokenService } from '../identity/infrastructure/crypto/hmac-token.service';
import { NOTIFICATION_REALTIME_PORT } from './application/ports/notification-realtime-port';
import { NotificationPublisher } from './application/services/notification-publisher';
import { CountUnreadNotificationsUseCase } from './application/use-cases/count-unread-notifications.use-case';
import { ListMyNotificationsUseCase } from './application/use-cases/list-my-notifications.use-case';
import { MarkAllNotificationsAsReadUseCase } from './application/use-cases/mark-all-notifications-as-read.use-case';
import { MarkNotificationAsReadUseCase } from './application/use-cases/mark-notification-as-read.use-case';
import { NOTIFICATION_REPOSITORY } from './domain/repositories/notification.repository';
import { PrismaNotificationRepository } from './infrastructure/persistence/prisma-notification.repository';
import { NotificationsController } from './presentation/notifications.controller';
import { NotificationsGateway } from './presentation/notifications.gateway';

@Module({
  controllers: [NotificationsController],
  providers: [
    PrismaService,
    ListMyNotificationsUseCase,
    CountUnreadNotificationsUseCase,
    MarkNotificationAsReadUseCase,
    MarkAllNotificationsAsReadUseCase,
    NotificationPublisher,
    NotificationsGateway,
    {
      provide: NOTIFICATION_REPOSITORY,
      useClass: PrismaNotificationRepository,
    },
    {
      provide: NOTIFICATION_REALTIME_PORT,
      useExisting: NotificationsGateway,
    },
    {
      provide: TOKEN_SERVICE,
      useClass: HmacTokenService,
    },
  ],
  exports: [NotificationPublisher],
})
export class NotificationsModule {}
