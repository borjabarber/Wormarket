export type ListingErrorCode =
  | 'DIMENSION_NOT_FOUND'
  | 'INVALID_AUTHORIZATION_HEADER'
  | 'INVALID_LISTING_BODY'
  | 'LISTING_FORBIDDEN'
  | 'LISTING_NOT_EDITABLE'
  | 'LISTING_NOT_FOUND'
  | 'SELLER_NOT_FOUND'
  | 'USER_BLOCKED';

export class ListingError extends Error {
  constructor(
    readonly code: ListingErrorCode,
    message: string,
    readonly statusCode: number,
  ) {
    super(message);
  }
}
