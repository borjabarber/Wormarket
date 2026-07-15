import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import RootLayout from './layout';
import { ThemeToggle } from '../shared/components/theme-toggle/theme-toggle';

describe('RootLayout', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    window.localStorage.clear();
    window.sessionStorage.clear();
    delete document.documentElement.dataset['theme'];
  });

  it('renders persistent navigation and footer in Spanish', () => {
    render(createElement(RootLayout, null, createElement('p', null, 'Contenido de prueba')));

    expect(screen.getByRole('link', { name: 'Saltar al contenido principal' })).toBeTruthy();
    expect(screen.getByRole('navigation', { name: 'Navegacion principal' })).toBeTruthy();
    expect(screen.getByRole('textbox', { name: 'Buscar objetos imposibles' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Inicia sesion' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Dimension oscura' })).toBeTruthy();
    expect(screen.queryByRole('link', { name: 'Vende un objeto' })).toBeNull();
    expect(
      screen.getByText('Wormarket, mercado interdimensional de objetos imposibles.'),
    ).toBeTruthy();
  });

  it('toggles the theme action label', () => {
    render(createElement(RootLayout, null, createElement('p', null, 'Contenido de prueba')));

    const themeButton = screen.getByRole('button', { name: 'Dimension oscura' });

    fireEvent.click(themeButton);

    expect(screen.getByRole('button', { name: 'Dimension luminosa' })).toBeTruthy();
    expect(document.documentElement.dataset['theme']).toBe('dark');
  });

  it('renders the theme toggle with a stable server label', () => {
    const markup = renderToString(createElement(ThemeToggle));

    expect(markup).toContain('Dimension oscura');
    expect(markup).toContain('aria-pressed="false"');
  });

  it('shows logout in the header when a session exists', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json({
          user: {
            displayName: 'Brais Moure',
            id: 'user-1',
            role: 'USER',
            username: 'braismoure',
          },
        }),
      ),
    );
    window.sessionStorage.setItem(
      'wormarket.auth.session',
      JSON.stringify({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          displayName: 'Brais Moure',
          id: 'user-1',
          role: 'USER',
          username: 'braismoure',
        },
      }),
    );

    render(createElement(RootLayout, null, createElement('p', null, 'Contenido de prueba')));

    expect(screen.getByRole('button', { name: 'Cerrar sesion' })).toBeTruthy();
    expect(screen.queryByRole('link', { name: 'Inicia sesion' })).toBeNull();
  });
});
