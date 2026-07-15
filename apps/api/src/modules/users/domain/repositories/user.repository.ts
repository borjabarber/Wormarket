import type { User } from '../entities/user';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepository {
  findAll(): Promise<User[]>;
  findByUsername(username: string): Promise<User | null>;
}
