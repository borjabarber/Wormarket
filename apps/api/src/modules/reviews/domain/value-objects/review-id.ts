export class ReviewId {
  private constructor(private readonly value: string) {}

  static create(value: string): ReviewId {
    const normalizedValue = value.trim();

    if (!normalizedValue) {
      throw new Error('Review id cannot be empty.');
    }

    return new ReviewId(normalizedValue);
  }

  toString(): string {
    return this.value;
  }
}
