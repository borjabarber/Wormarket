import { describe, expect, it } from 'vitest';

import { Report } from './report';

const createdAt = new Date('2026-07-09T12:00:00.000Z');

describe('Report', () => {
  it('creates listing reports with normalized description', () => {
    const report = Report.create({
      id: 'report-1',
      reporter: {
        id: 'user-1',
        username: 'lyra-oraculo',
        displayName: 'Lyra del Oraculo',
      },
      targetType: 'LISTING',
      listing: {
        id: 'listing-1',
        slug: 'reloj',
        title: 'Reloj imposible',
        status: 'PUBLISHED',
      },
      reportedUser: null,
      reason: 'FORBIDDEN_OBJECT',
      description: '  Puede romper una regla dimensional importante.  ',
      status: 'PENDING',
      resolution: null,
      resolvedBy: null,
      resolvedAt: null,
      createdAt,
      updatedAt: createdAt,
    });

    expect(report.description).toBe('Puede romper una regla dimensional importante.');
    expect(report.targetType).toBe('LISTING');
  });

  it('rejects user reports without a reported user target', () => {
    expect(() =>
      Report.create({
        id: 'report-1',
        reporter: {
          id: 'user-1',
          username: 'lyra-oraculo',
          displayName: 'Lyra del Oraculo',
        },
        targetType: 'USER',
        listing: null,
        reportedUser: null,
        reason: 'FRAUD',
        description: 'Denuncia suficientemente descriptiva.',
        status: 'PENDING',
        resolution: null,
        resolvedBy: null,
        resolvedAt: null,
        createdAt,
        updatedAt: createdAt,
      }),
    ).toThrow('User report must include a user target.');
  });
});
