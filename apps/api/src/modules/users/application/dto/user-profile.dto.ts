import type { UserRole, UserStatus } from '../../domain/entities/user';

export type UserHomeDimensionDto = {
  id: string;
  slug: string;
  name: string;
};

export type UserProfileDto = {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  homeDimension: UserHomeDimensionDto;
  reputation: number;
  role: UserRole;
  status: UserStatus;
};
