export type NotificationType =
  | 'OFFER_RECEIVED'
  | 'OFFER_ACCEPTED'
  | 'OFFER_REJECTED'
  | 'MESSAGE_RECEIVED'
  | 'TRANSACTION_COMPLETED'
  | 'REVIEW_RECEIVED';

export type NotificationSummary = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  linkPath: string | null;
  readAt: string | null;
  createdAt: string;
};

export type UnreadNotificationCount = {
  unreadCount: number;
};
