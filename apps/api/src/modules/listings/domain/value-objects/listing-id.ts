export class ListingId {
  private constructor(private readonly rawValue: string) {}

  static create(value: string): ListingId {
    const normalizedValue = value.trim();

    if (normalizedValue.length === 0) {
      throw new Error('Listing id cannot be empty.');
    }

    return new ListingId(normalizedValue);
  }

  toString(): string {
    return this.rawValue;
  }
}
