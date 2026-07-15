export type ReviewUserDto = {
  id: string;
  username: string;
  displayName: string;
};

export type ReviewDto = {
  id: string;
  transaction: {
    id: string;
    listing: {
      id: string;
      slug: string;
      title: string;
    };
    completedAt: string | null;
  };
  reviewer: ReviewUserDto;
  reviewee: ReviewUserDto;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
};
