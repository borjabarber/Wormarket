export const PASSWORD_HASHER = Symbol('PASSWORD_HASHER');

export interface PasswordHasher {
  hash(password: string): string;
  verify(password: string, hash: string): boolean;
}
