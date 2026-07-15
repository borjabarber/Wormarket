export type CreateReviewDto = {
  transactionId: string;
  rating: number;
  comment?: string | null;
};
