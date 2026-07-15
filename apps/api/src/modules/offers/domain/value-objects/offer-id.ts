export class OfferId {
  private constructor(private readonly value: string) {}

  static create(value: string): OfferId {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      throw new Error('Offer id cannot be empty.');
    }

    return new OfferId(trimmedValue);
  }

  toString(): string {
    return this.value;
  }
}
