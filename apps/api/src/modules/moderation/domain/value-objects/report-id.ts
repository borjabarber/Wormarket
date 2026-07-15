export class ReportId {
  private constructor(private readonly value: string) {}

  static create(value: string): ReportId {
    const normalized = value.trim();

    if (!normalized) {
      throw new Error('Report id cannot be empty.');
    }

    return new ReportId(normalized);
  }

  toString(): string {
    return this.value;
  }
}
