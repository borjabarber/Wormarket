import { UserId } from '../value-objects/user-id';
import { Username } from '../value-objects/username';

export const userRoles = ['USER', 'MODERATOR', 'ADMIN'] as const;
export const userStatuses = ['ACTIVE', 'BLOCKED'] as const;

export type UserRole = (typeof userRoles)[number];
export type UserStatus = (typeof userStatuses)[number];

export type UserHomeDimension = {
  id: string;
  slug: string;
  name: string;
};

type UserProperties = {
  id: UserId;
  username: Username;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  homeDimension: UserHomeDimension;
  reputation: number;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
};

type CreateUserInput = Omit<UserProperties, 'id' | 'username' | 'status'> & {
  id: string;
  username: string;
  status?: UserStatus;
};

export class User {
  private constructor(private readonly properties: UserProperties) {}

  static create(input: CreateUserInput): User {
    const displayName = input.displayName.trim();
    const bio = input.bio.trim();

    if (displayName.length < 2) {
      throw new Error('User display name must contain at least two characters.');
    }

    if (!Number.isInteger(input.reputation) || input.reputation < 0) {
      throw new Error('User reputation must be a non-negative integer.');
    }

    if (!userRoles.includes(input.role)) {
      throw new Error('User role is not supported.');
    }

    const status = input.status ?? 'ACTIVE';

    if (!userStatuses.includes(status)) {
      throw new Error('User status is not supported.');
    }

    return new User({
      ...input,
      id: UserId.create(input.id),
      username: Username.create(input.username),
      displayName,
      bio,
      homeDimension: { ...input.homeDimension },
      status,
    });
  }

  get id(): UserId {
    return this.properties.id;
  }

  get username(): Username {
    return this.properties.username;
  }

  get displayName(): string {
    return this.properties.displayName;
  }

  get bio(): string {
    return this.properties.bio;
  }

  get avatarUrl(): string | null {
    return this.properties.avatarUrl;
  }

  get homeDimension(): UserHomeDimension {
    return { ...this.properties.homeDimension };
  }

  get reputation(): number {
    return this.properties.reputation;
  }

  get role(): UserRole {
    return this.properties.role;
  }

  get status(): UserStatus {
    return this.properties.status;
  }

  get createdAt(): Date {
    return this.properties.createdAt;
  }

  get updatedAt(): Date {
    return this.properties.updatedAt;
  }
}
