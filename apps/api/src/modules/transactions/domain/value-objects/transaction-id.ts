export class TransactionId {
  private constructor(private readonly value: string) {}

  static create(value: string): TransactionId {
    const normalized = value.trim();

    if (!normalized) {
      throw new Error('Transaction id cannot be empty.');
    }

    return new TransactionId(normalized);
  }

  toString(): string {
    return this.value;
  }
}
