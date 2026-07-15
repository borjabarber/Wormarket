import { describe, expect, it } from 'vitest';

import { Dimension } from '../../domain/entities/dimension';
import type { DimensionRepository } from '../../domain/repositories/dimension.repository';
import { ListDimensionsUseCase } from './list-dimensions.use-case';

function createDimension(name: string): Dimension {
  return Dimension.create({
    id: name.toLowerCase().replaceAll(' ', '-'),
    slug: name.toLowerCase().replaceAll(' ', '-'),
    name,
    description: 'Dimension de prueba.',
    currencyCode: 'AUR',
    currencyName: 'Aurora',
    exchangeRate: 1,
    shippingRules: 'Reglas de envio.',
    forbiddenObjects: [],
    createdAt: new Date('2026-07-09T00:00:00.000Z'),
    updatedAt: new Date('2026-07-09T00:00:00.000Z'),
  });
}

describe('ListDimensionsUseCase', () => {
  it('returns dimensions as DTOs without exposing domain objects', async () => {
    const repository: DimensionRepository = {
      findAll: async () => [createDimension('Oraculo Norte')],
    };
    const useCase = new ListDimensionsUseCase(repository);

    const result = await useCase.execute();

    expect(result).toEqual([
      {
        id: 'oraculo-norte',
        slug: 'oraculo-norte',
        name: 'Oraculo Norte',
        description: 'Dimension de prueba.',
        currencyCode: 'AUR',
        currencyName: 'Aurora',
        exchangeRate: 1,
        shippingRules: 'Reglas de envio.',
        forbiddenObjects: [],
      },
    ]);
  });
});
