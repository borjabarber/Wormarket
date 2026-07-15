export class MessageId {
  private constructor(private readonly value: string) {}

  static create(value: string): MessageId {
    const normalized = value.trim();

    if (!normalized) {
      throw new Error('Message id cannot be empty.');
    }

    return new MessageId(normalized);
  }

  toString(): string {
    return this.value;
  }
}
