import type { NotificationType } from './notification-types';

export const notificationTypeLabels: Record<NotificationType, string> = {
  MESSAGE_RECEIVED: 'Mensaje',
  OFFER_ACCEPTED: 'Oferta aceptada',
  OFFER_RECEIVED: 'Oferta recibida',
  OFFER_REJECTED: 'Oferta rechazada',
  REVIEW_RECEIVED: 'Valoracion',
  TRANSACTION_COMPLETED: 'Transaccion',
};

export function formatNotificationDate(value: string): string {
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}
