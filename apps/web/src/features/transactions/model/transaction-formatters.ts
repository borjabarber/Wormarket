import type { TransactionStatus } from './transaction-types';

export const transactionStatusLabels: Record<TransactionStatus, string> = {
  CANCELLED: 'Cancelada',
  COMPLETED: 'Completada',
  PENDING_DELIVERY: 'Pendiente de entrega',
};

export function formatTransactionAmount(amount: { amount: number; currencyCode: string }): string {
  return `${amount.amount} ${amount.currencyCode}`;
}

export function formatTransactionDate(value: string | null): string {
  if (!value) {
    return 'Pendiente';
  }

  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
  }).format(new Date(value));
}
