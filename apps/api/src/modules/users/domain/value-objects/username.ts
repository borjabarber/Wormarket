export class Username {
  private constructor(private readonly rawValue: string) {}

  static create(value: string): Username {
    const normalizedValue = value.trim().toLowerCase();

    if (normalizedValue.length < 3 || normalizedValue.length > 32) {
      throw new Error('Username must contain between 3 and 32 characters.');
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedValue)) {
      throw new Error('Username must be URL friendly.');
    }

    return new Username(normalizedValue);
  }

  toString(): string {
    return this.rawValue;
  }
}
