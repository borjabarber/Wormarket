import { describe, expect, it } from 'vitest';

import { Dimension } from './dimension';

const validDimensionInput = {
  id: 'dimension-1',
  slug: 'oraculo-norte',
  name: 'Oraculo Norte',
  description: 'Dimension de prueba.',
  currencyCode: 'aur',
  currencyName: 'Aurora',
  exchangeRate: 1.2,
  shippingRules: 'Reglas de envio.',
  forbiddenObjects: ['paradojas abiertas'],
  createdAt: new Date('2026-07-09T00:00:00.000Z'),
  updatedAt: new Date('2026-07-09T00:00:00.000Z'),
};

describe('Dimension', () => {
  it('creates a valid dimension and normalizes its currency code', () => {
    const dimension = Dimension.create(validDimensionInput);

    expect(dimension.id.toString()).toBe('dimension-1');
    expect(dimension.slug).toBe('oraculo-norte');
    expect(dimension.currencyCode).toBe('AUR');
  });

  it('rejects invalid slugs', () => {
    expect(() =>
      Dimension.create({
        ...validDimensionInput,
        slug: 'Oraculo Norte',
      }),
    ).toThrow('Dimension slug must be URL friendly.');
  });

  it('rejects non-positive exchange rates', () => {
    expect(() =>
      Dimension.create({
        ...validDimensionInput,
        exchangeRate: 0,
      }),
    ).toThrow('Dimension exchange rate must be greater than zero.');
  });
});
