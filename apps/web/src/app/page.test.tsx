import { cleanup, render, screen } from '@testing-library/react';
import { createElement } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AppProviders } from '../features/auth/model/use-auth';
import HomePage from './page';

describe('HomePage', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('renders the Wormarket home content in Spanish', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json([])),
    );

    render(createElement(AppProviders, null, createElement(HomePage)));

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Dale una segunda vida a tus objetos imposibles',
      }),
    ).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Explorar objetos' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Vende un objeto' })).toBeTruthy();
    expect(screen.getByText('Anuncios disponibles')).toBeTruthy();
    expect(screen.queryByText('Marketplace interdimensional')).toBeNull();
    expect(screen.queryByText('Backend local listo para operar')).toBeNull();
  });
});
