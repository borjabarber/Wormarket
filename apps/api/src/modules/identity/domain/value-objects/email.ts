export class Email {
  private constructor(private readonly rawValue: string) {}

  static create(value: string): Email {
    const normalizedValue = value.trim().toLowerCase();

    if (normalizedValue.length > 254) {
      throw new Error('Email cannot exceed 254 characters.');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedValue)) {
      throw new Error('Email must be valid.');
    }

    return new Email(normalizedValue);
  }

  toString(): string {
    return this.rawValue;
  }
}
