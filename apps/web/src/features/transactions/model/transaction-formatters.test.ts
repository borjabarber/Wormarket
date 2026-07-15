import { describe, expect, it } from 'vitest';

import {
  formatTransactionAmount,
  formatTransactionDate,
  transactionStatusLabels,
} from './transaction-formatters';

describe('transaction formatters', () => {
  it('formats transaction amounts and status labels', () => {
    expect(formatTransactionAmount({ amount: 315, currencyCode: 'MIN' })).toBe('315 MIN');
    expect(transactionStatusLabels['PENDING_DELIVERY']).toBe('Pendiente de entrega');
    expect(transactionStatusLabels['COMPLETED']).toBe('Completada');
    expect(transactionStatusLabels['CANCELLED']).toBe('Cancelada');
  });

  it('shows pending when the transaction has no completion date', () => {
    expect(formatTransactionDate(null)).toBe('Pendiente');
  });
});
