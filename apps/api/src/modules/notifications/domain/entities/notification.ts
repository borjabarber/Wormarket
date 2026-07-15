import { NotificationId } from '../value-objects/notification-id';

export const notificationTypes = [
  'OFFER_RECEIVED',
  'OFFER_ACCEPTED',
  'OFFER_REJECTED',
  'MESSAGE_RECEIVED',
  'TRANSACTION_COMPLETED',
  'REVIEW_RECEIVED',
] as const;

export type NotificationType = (typeof notificationTypes)[number];

type NotificationProperties = {
  id: NotificationId;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  linkPath: string | null;
  readAt: Date | null;
  createdAt: Date;
};

type CreateNotificationInput = Omit<NotificationProperties, 'id'> & {
  id: string;
};

export class Notification {
  private constructor(private readonly properties: NotificationProperties) {}

  static create(input: CreateNotificationInput): Notification {
    if (!notificationTypes.includes(input.type)) {
      throw new Error('Notification type is not supported.');
    }

    const title = input.title.trim();
    const message = input.message.trim();
    const linkPath = input.linkPath?.trim() || null;

    if (!input.userId.trim()) {
      throw new Error('Notification user id cannot be empty.');
    }

    if (!title) {
      throw new Error('Notification title cannot be empty.');
    }

    if (!message) {
      throw new Error('Notification message cannot be empty.');
    }

    return new Notification({
      ...input,
      id: NotificationId.create(input.id),
      title,
      message,
      linkPath,
    });
  }

  get id(): NotificationId {
    return this.properties.id;
  }

  get userId(): string {
    return this.properties.userId;
  }

  get type(): NotificationType {
    return this.properties.type;
  }

  get title(): string {
    return this.properties.title;
  }

  get message(): string {
    return this.properties.message;
  }

  get linkPath(): string | null {
    return this.properties.linkPath;
  }

  get readAt(): Date | null {
    return this.properties.readAt;
  }

  get createdAt(): Date {
    return this.properties.createdAt;
  }
}
