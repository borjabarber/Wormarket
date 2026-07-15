export type ModerationErrorCode =
  | 'FORBIDDEN_MODERATION_ACTION'
  | 'INVALID_AUTHORIZATION_HEADER'
  | 'INVALID_MODERATION_BODY'
  | 'LISTING_NOT_FOUND'
  | 'REPORT_NOT_FOUND'
  | 'USER_NOT_FOUND'
  | 'USER_REPORT_SELF';

export class ModerationError extends Error {
  constructor(
    readonly code: ModerationErrorCode,
    message: string,
    readonly statusCode: number,
  ) {
    super(message);
  }
}
