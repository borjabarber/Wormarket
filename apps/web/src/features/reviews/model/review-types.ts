export type ReviewUser = {
  displayName: string;
  id: string;
  username: string;
};

export type ReviewSummary = {
  comment: string | null;
  createdAt: string;
  id: string;
  rating: number;
  reviewee: ReviewUser;
  reviewer: ReviewUser;
  transaction: {
    completedAt: string | null;
    id: string;
    listing: {
      id: string;
      slug: string;
      title: string;
    };
  };
  updatedAt: string;
};

export type CreateReviewInput = {
  comment?: string | null;
  rating: number;
  transactionId: string;
};
