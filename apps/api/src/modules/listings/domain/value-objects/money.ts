export class Money {
  private constructor(
    readonly amount: number,
    readonly currencyCode: string,
  ) {}

  static create(amount: number, currencyCode: string): Money {
    const normalizedCurrencyCode = currencyCode.trim().toUpperCase();

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Listing price must be greater than zero.');
    }

    if (!/^[A-Z]{3,8}$/.test(normalizedCurrencyCode)) {
      throw new Error('Listing currency code must contain 3 to 8 uppercase letters.');
    }

    return new Money(amount, normalizedCurrencyCode);
  }
}
