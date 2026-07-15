export type DimensionDto = {
  id: string;
  slug: string;
  name: string;
  description: string;
  currencyCode: string;
  currencyName: string;
  exchangeRate: number;
  shippingRules: string;
  forbiddenObjects: string[];
};
