export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN';

export type UserStatus = 'ACTIVE' | 'BLOCKED';

export type UserHomeDimension = {
  id: string;
  name: string;
  slug: string;
};

export type UserProfile = {
  avatarUrl: string | null;
  bio: string;
  displayName: string;
  homeDimension: UserHomeDimension;
  id: string;
  reputation: number;
  role: UserRole;
  status: UserStatus;
  username: string;
};
