export class FavoriteId {
  private constructor(private readonly value: string) {}

  static create(value: string): FavoriteId {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      throw new Error('Favorite id cannot be empty.');
    }

    return new FavoriteId(trimmedValue);
  }

  toString(): string {
    return this.value;
  }
}
