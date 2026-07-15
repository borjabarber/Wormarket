import { describe, expect, it } from 'vitest';

import type { DimensionDto } from '../application/dto/dimension.dto';
import { DimensionsController } from './dimensions.controller';

describe('DimensionsController', () => {
  it('lists dimensions through the use case', async () => {
    const dimensions: DimensionDto[] = [
      {
        id: 'dimension-1',
        slug: 'oraculo-norte',
        name: 'Oraculo Norte',
        description: 'Dimension de prueba.',
        currencyCode: 'AUR',
        currencyName: 'Aurora',
        exchangeRate: 1,
        shippingRules: 'Reglas de envio.',
        forbiddenObjects: [],
      },
    ];
    const controller = new DimensionsController({
      execute: async () => dimensions,
    });

    await expect(controller.listDimensions()).resolves.toEqual(dimensions);
  });
});
