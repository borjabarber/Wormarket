import { describe, expect, it } from 'vitest';

import { Email } from './email';

describe('Email', () => {
  it('normalizes valid emails', () => {
    const email = Email.create(' LYRA@WORMARKET.LOCAL ');

    expect(email.toString()).toBe('lyra@wormarket.local');
  });

  it('rejects invalid emails', () => {
    expect(() => Email.create('lyra')).toThrow('Email must be valid.');
  });
});
