import { describe, expect, it } from 'vitest';

import { User } from './user';

const validUserInput = {
  id: 'user-1',
  username: 'lyra-oraculo',
  displayName: 'Lyra del Oraculo',
  bio: 'Tasadora de reliquias imposibles.',
  avatarUrl: null,
  homeDimension: {
    id: 'dimension-1',
    slug: 'oraculo-norte',
    name: 'Oraculo Norte',
  },
  reputation: 42,
  role: 'USER' as const,
  createdAt: new Date('2026-07-09T00:00:00.000Z'),
  updatedAt: new Date('2026-07-09T00:00:00.000Z'),
};

describe('User', () => {
  it('creates a valid user and normalizes its username', () => {
    const user = User.create({
      ...validUserInput,
      username: 'Lyra-Oraculo',
    });

    expect(user.id.toString()).toBe('user-1');
    expect(user.username.toString()).toBe('lyra-oraculo');
    expect(user.homeDimension.slug).toBe('oraculo-norte');
  });

  it('rejects invalid usernames', () => {
    expect(() =>
      User.create({
        ...validUserInput,
        username: 'lyra oraculo',
      }),
    ).toThrow('Username must be URL friendly.');
  });

  it('rejects negative reputation', () => {
    expect(() =>
      User.create({
        ...validUserInput,
        reputation: -1,
      }),
    ).toThrow('User reputation must be a non-negative integer.');
  });
});
