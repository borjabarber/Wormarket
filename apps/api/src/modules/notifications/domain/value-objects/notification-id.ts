export class NotificationId {
  private constructor(private readonly value: string) {}

  static create(value: string): NotificationId {
    const normalizedValue = value.trim();

    if (!normalizedValue) {
      throw new Error('Notification id cannot be empty.');
    }

    return new NotificationId(normalizedValue);
  }

  toString(): string {
    return this.value;
  }
}
