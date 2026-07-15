import type { Dimension } from '../../domain/entities/dimension';
import type { DimensionDto } from '../dto/dimension.dto';

export class DimensionMapper {
  static toDto(dimension: Dimension): DimensionDto {
    return {
      id: dimension.id.toString(),
      slug: dimension.slug,
      name: dimension.name,
      description: dimension.description,
      currencyCode: dimension.currencyCode,
      currencyName: dimension.currencyName,
      exchangeRate: dimension.exchangeRate,
      shippingRules: dimension.shippingRules,
      forbiddenObjects: dimension.forbiddenObjects,
    };
  }
}
