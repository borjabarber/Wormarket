import { afterEach, describe, expect, it } from 'vitest';

import { getAllowedFrontendOrigins, isAllowedFrontendOrigin } from './frontend-origins';

const originalFrontendUrl = process.env['FRONTEND_URL'];

describe('frontend origins config', () => {
  afterEach(() => {
    process.env['FRONTEND_URL'] = originalFrontendUrl;
  });

  it('allows only configured and local frontend origins', () => {
    process.env['FRONTEND_URL'] = 'http://localhost:4000';

    expect(getAllowedFrontendOrigins()).toEqual([
      'http://localhost:4000',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ]);
    expect(isAllowedFrontendOrigin(undefined)).toBe(true);
    expect(isAllowedFrontendOrigin('http://localhost:3000')).toBe(true);
    expect(isAllowedFrontendOrigin('http://127.0.0.1:3000')).toBe(true);
    expect(isAllowedFrontendOrigin('http://localhost:4000')).toBe(true);
    expect(isAllowedFrontendOrigin('https://evil.example')).toBe(false);
  });
});
