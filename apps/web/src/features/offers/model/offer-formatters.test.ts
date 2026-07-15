import { describe, expect, it } from 'vitest';

import { formatOfferAmount, offerStatusLabels } from './offer-formatters';

describe('offer formatters', () => {
  it('formats offer amounts and status labels', () => {
    expect(formatOfferAmount({ amount: 165, currencyCode: 'AUR' })).toBe('165 AUR');
    expect(offerStatusLabels['PENDING']).toBe('Pendiente');
    expect(offerStatusLabels['ACCEPTED']).toBe('Aceptada');
    expect(offerStatusLabels['REJECTED']).toBe('Rechazada');
    expect(offerStatusLabels['CANCELLED']).toBe('Cancelada');
  });
});
