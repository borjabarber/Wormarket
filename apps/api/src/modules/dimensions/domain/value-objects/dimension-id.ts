export class DimensionId {
  private constructor(private readonly rawValue: string) {}

  static create(value: string): DimensionId {
    const normalizedValue = value.trim();

    if (normalizedValue.length === 0) {
      throw new Error('Dimension id cannot be empty.');
    }

    return new DimensionId(normalizedValue);
  }

  toString(): string {
    return this.rawValue;
  }
}
