export class ConversationId {
  private constructor(private readonly value: string) {}

  static create(value: string): ConversationId {
    const normalized = value.trim();

    if (!normalized) {
      throw new Error('Conversation id cannot be empty.');
    }

    return new ConversationId(normalized);
  }

  toString(): string {
    return this.value;
  }
}
