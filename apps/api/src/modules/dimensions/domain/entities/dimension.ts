import { DimensionId } from '../value-objects/dimension-id';

type DimensionProperties = {
  id: DimensionId;
  slug: string;
  name: string;
  description: string;
  currencyCode: string;
  currencyName: string;
  exchangeRate: number;
  shippingRules: string;
  forbiddenObjects: string[];
  createdAt: Date;
  updatedAt: Date;
};

type CreateDimensionInput = Omit<DimensionProperties, 'id'> & {
  id: string;
};

export class Dimension {
  private constructor(private readonly properties: DimensionProperties) {}

  static create(input: CreateDimensionInput): Dimension {
    const name = input.name.trim();
    const slug = input.slug.trim();
    const currencyCode = input.currencyCode.trim().toUpperCase();

    if (name.length < 2) {
      throw new Error('Dimension name must contain at least two characters.');
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new Error('Dimension slug must be URL friendly.');
    }

    if (!/^[A-Z]{3,8}$/.test(currencyCode)) {
      throw new Error('Dimension currency code must contain 3 to 8 uppercase letters.');
    }

    if (!Number.isFinite(input.exchangeRate) || input.exchangeRate <= 0) {
      throw new Error('Dimension exchange rate must be greater than zero.');
    }

    return new Dimension({
      ...input,
      id: DimensionId.create(input.id),
      slug,
      name,
      currencyCode,
      forbiddenObjects: [...input.forbiddenObjects],
    });
  }

  get id(): DimensionId {
    return this.properties.id;
  }

  get slug(): string {
    return this.properties.slug;
  }

  get name(): string {
    return this.properties.name;
  }

  get description(): string {
    return this.properties.description;
  }

  get currencyCode(): string {
    return this.properties.currencyCode;
  }

  get currencyName(): string {
    return this.properties.currencyName;
  }

  get exchangeRate(): number {
    return this.properties.exchangeRate;
  }

  get shippingRules(): string {
    return this.properties.shippingRules;
  }

  get forbiddenObjects(): string[] {
    return [...this.properties.forbiddenObjects];
  }

  get createdAt(): Date {
    return this.properties.createdAt;
  }

  get updatedAt(): Date {
    return this.properties.updatedAt;
  }
}
