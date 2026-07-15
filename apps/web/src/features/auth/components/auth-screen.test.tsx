import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AppProviders } from '../model/use-auth';
import { AuthScreen } from './auth-screen';

function renderAuthScreen() {
  return render(
    <AppProviders>
      <AuthScreen />
    </AppProviders>,
  );
}

function mockFetchWithSession() {
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);

    if (url.endsWith('/identity/login')) {
      return Response.json({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          displayName: 'Iria Portal',
          id: 'user-1',
          role: 'USER',
          username: 'iria-portal',
        },
      });
    }

    if (url.endsWith('/identity/me')) {
      return Response.json({
        user: {
          displayName: 'Iria Portal',
          id: 'user-1',
          role: 'USER',
          username: 'iria-portal',
        },
      });
    }

    return Response.json({ code: 'UNKNOWN_API_ERROR', message: 'No encontrado.' }, { status: 404 });
  });

  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('AuthScreen', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    window.sessionStorage.clear();
  });

  it('renders login and register options in Spanish', () => {
    renderAuthScreen();

    const loginTab = screen.getByRole('tab', { name: 'Iniciar sesion' });
    const registerTab = screen.getByRole('tab', { name: 'Crear cuenta' });

    expect(screen.getByRole('heading', { name: 'Accede a Wormarket' })).toBeTruthy();
    expect(loginTab.getAttribute('aria-selected')).toBe('true');
    expect(loginTab.getAttribute('aria-controls')).toBe('auth-panel-login');
    expect(registerTab.getAttribute('aria-selected')).toBe('false');
    expect(registerTab.getAttribute('aria-controls')).toBe('auth-panel-register');
    expect(screen.getByRole('tabpanel', { name: 'Iniciar sesion' })).toBeTruthy();
    expect(screen.getByLabelText('Correo dimensional')).toBeTruthy();
    expect(screen.getByLabelText('Contrasena')).toBeTruthy();
  });

  it('moves between authentication tabs with the keyboard', async () => {
    const user = userEvent.setup();
    renderAuthScreen();

    const loginTab = screen.getByRole('tab', { name: 'Iniciar sesion' });
    loginTab.focus();

    await user.keyboard('{ArrowRight}');

    const registerTab = screen.getByRole('tab', { name: 'Crear cuenta' });
    expect(registerTab.getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(registerTab);
    expect(screen.getByRole('tabpanel', { name: 'Crear cuenta' })).toBeTruthy();

    await user.keyboard('{Home}');

    expect(screen.getByRole('tab', { name: 'Iniciar sesion' }).getAttribute('aria-selected')).toBe(
      'true',
    );
  });

  it('shows accessible validation errors before login', async () => {
    const user = userEvent.setup();
    renderAuthScreen();

    await user.click(screen.getByRole('button', { name: 'Iniciar sesion' }));

    const alerts = await screen.findAllByRole('alert');

    expect(alerts.map((alert) => alert.textContent).join(' ')).toContain('Indica tu contrasena.');
    expect(document.activeElement).toBe(screen.getByLabelText('Correo dimensional'));
  });

  it('logs in and displays a customer-friendly welcome', async () => {
    const fetchMock = mockFetchWithSession();
    const user = userEvent.setup();
    renderAuthScreen();

    await user.type(screen.getByLabelText('Correo dimensional'), 'iria@example.test');
    await user.type(screen.getByLabelText('Contrasena'), 'portal123');
    await user.click(screen.getByRole('button', { name: 'Iniciar sesion' }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Hola, Iria Portal' })).toBeTruthy();
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/identity/login',
      expect.objectContaining({
        method: 'POST',
      }),
    );
    expect(screen.getByText(/@iria-portal/)).toBeTruthy();
    expect(screen.queryByRole('tab', { name: 'Iniciar sesion' })).toBeNull();
    expect(screen.queryByRole('tab', { name: 'Crear cuenta' })).toBeNull();
    expect(screen.queryByLabelText('Correo dimensional')).toBeNull();
    expect(screen.getByRole('link', { name: 'Explorar' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Cerrar sesion' })).toBeNull();
    expect(screen.queryByText('Access token local activo para llamadas privadas.')).toBeNull();
  });

  it('renders register fields when switching mode', async () => {
    const user = userEvent.setup();
    renderAuthScreen();

    await user.click(screen.getByRole('tab', { name: 'Crear cuenta' }));

    expect(screen.getByLabelText('Nombre visible')).toBeTruthy();
    expect(screen.getByLabelText('Alias publico')).toBeTruthy();
    expect(screen.getByLabelText('Dimension de origen')).toBeTruthy();
    expect(screen.getByLabelText('Biografia dimensional')).toBeTruthy();
  });
});
