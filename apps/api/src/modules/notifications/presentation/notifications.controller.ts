import { Controller, Get, Headers, HttpException, Inject, Param, Post } from '@nestjs/common';

import { IdentityError } from '../../identity/application/errors/identity-error';
import { TOKEN_SERVICE, type TokenService } from '../../identity/application/ports/token-service';
import type {
  NotificationDto,
  UnreadNotificationCountDto,
} from '../application/dto/notification.dto';
import { NotificationError } from '../application/errors/notification-error';
import { CountUnreadNotificationsUseCase } from '../application/use-cases/count-unread-notifications.use-case';
import { ListMyNotificationsUseCase } from '../application/use-cases/list-my-notifications.use-case';
import { MarkAllNotificationsAsReadUseCase } from '../application/use-cases/mark-all-notifications-as-read.use-case';
import { MarkNotificationAsReadUseCase } from '../application/use-cases/mark-notification-as-read.use-case';

@Controller('notifications')
export class NotificationsController {
  constructor(
    @Inject(ListMyNotificationsUseCase)
    private readonly listMyNotificationsUseCase: ListMyNotificationsUseCase,
    @Inject(CountUnreadNotificationsUseCase)
    private readonly countUnreadNotificationsUseCase: CountUnreadNotificationsUseCase,
    @Inject(MarkNotificationAsReadUseCase)
    private readonly markNotificationAsReadUseCase: MarkNotificationAsReadUseCase,
    @Inject(MarkAllNotificationsAsReadUseCase)
    private readonly markAllNotificationsAsReadUseCase: MarkAllNotificationsAsReadUseCase,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
  ) {}

  @Get()
  async listMyNotifications(
    @Headers('authorization') authorization: string | undefined,
  ): Promise<NotificationDto[]> {
    return this.mapNotificationErrors(() => {
      const user = this.tokenService.verify(this.parseBearerToken(authorization), 'access');

      return this.listMyNotificationsUseCase.execute(user.sub);
    });
  }

  @Get('unread-count')
  async countUnreadNotifications(
    @Headers('authorization') authorization: string | undefined,
  ): Promise<UnreadNotificationCountDto> {
    return this.mapNotificationErrors(() => {
      const user = this.tokenService.verify(this.parseBearerToken(authorization), 'access');

      return this.countUnreadNotificationsUseCase.execute(user.sub);
    });
  }

  @Post(':notificationId/read')
  async markNotificationAsRead(
    @Headers('authorization') authorization: string | undefined,
    @Param('notificationId') notificationId: string,
  ): Promise<NotificationDto> {
    return this.mapNotificationErrors(() => {
      const user = this.tokenService.verify(this.parseBearerToken(authorization), 'access');

      return this.markNotificationAsReadUseCase.execute(user.sub, notificationId);
    });
  }

  @Post('read-all')
  async markAllNotificationsAsRead(
    @Headers('authorization') authorization: string | undefined,
  ): Promise<NotificationDto[]> {
    return this.mapNotificationErrors(() => {
      const user = this.tokenService.verify(this.parseBearerToken(authorization), 'access');

      return this.markAllNotificationsAsReadUseCase.execute(user.sub);
    });
  }

  private parseBearerToken(authorization: string | undefined): string {
    if (!authorization?.startsWith('Bearer ')) {
      throw new NotificationError(
        'INVALID_AUTHORIZATION_HEADER',
        'La cabecera de autorizacion no es valida.',
        401,
      );
    }

    return authorization.slice('Bearer '.length).trim();
  }

  private async mapNotificationErrors<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error: unknown) {
      if (error instanceof NotificationError) {
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
