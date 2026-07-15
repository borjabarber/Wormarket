export class UserId {
  private constructor(private readonly rawValue: string) {}

  static create(value: string): UserId {
    const normalizedValue = value.trim();

    if (normalizedValue.length === 0) {
      throw new Error('User id cannot be empty.');
    }

    return new UserId(normalizedValue);
  }

  toString(): string {
    return this.rawValue;
  }
}
