import { describe, expect, it } from 'vitest';

import { NodePasswordHasher } from './node-password-hasher';

describe('NodePasswordHasher', () => {
  it('hashes and verifies passwords without storing the raw password', () => {
    const hasher = new NodePasswordHasher();

    const hash = hasher.hash('Portal123');

    expect(hash).not.toContain('Portal123');
    expect(hasher.verify('Portal123', hash)).toBe(true);
    expect(hasher.verify('Wrong123', hash)).toBe(false);
  });
});
