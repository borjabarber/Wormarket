import type { Dimension as PrismaDimension } from '../../../../generated/prisma/client';
import { Dimension } from '../../domain/entities/dimension';

export class PrismaDimensionMapper {
  static toDomain(record: PrismaDimension): Dimension {
    return Dimension.create({
      id: record.id,
      slug: record.slug,
      name: record.name,
      description: record.description,
      currencyCode: record.currencyCode,
      currencyName: record.currencyName,
      exchangeRate: record.exchangeRate,
      shippingRules: record.shippingRules,
      forbiddenObjects: record.forbiddenObjects,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
