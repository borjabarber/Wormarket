import { describe, expect, it } from 'vitest';

import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('returns the API health status', () => {
    const controller = new HealthController();

    const response = controller.getHealth();

    expect(response.status).toBe('ok');
    expect(response.service).toBe('wormarket-api');
    expect(Date.parse(response.timestamp)).not.toBeNaN();
  });
});
