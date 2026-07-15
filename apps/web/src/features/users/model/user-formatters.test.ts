import { describe, expect, it } from 'vitest';

import { formatReputation, roleLabels, statusLabels } from './user-formatters';

describe('user formatters', () => {
  it('formats public role and status labels in Spanish', () => {
    expect(roleLabels['USER']).toBe('Usuario');
    expect(roleLabels['MODERATOR']).toBe('Moderacion');
    expect(roleLabels['ADMIN']).toBe('Administracion');
    expect(statusLabels['ACTIVE']).toBe('Activo');
    expect(statusLabels['BLOCKED']).toBe('Bloqueado');
  });

  it('rounds reputation points for display', () => {
    expect(formatReputation(87.4)).toBe('87 puntos');
    expect(formatReputation(87.6)).toBe('88 puntos');
  });
});
