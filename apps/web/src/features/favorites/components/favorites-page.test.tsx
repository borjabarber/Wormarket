import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { storeSession } from '../../auth/api/auth-storage';
import { AppProviders } from '../../auth/model/use-auth';
import type { FavoriteSummary } from '../model/favorite-types';
import { FavoritesPage } from './favorites-page';

const userSession = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  user: {
    displayName: 'Lyra del Oraculo',
    id: 'user-1',
    role: 'USER' as const,
    username: 'lyra-oraculo',
  },
};

const favorite: FavoriteSummary = {
  createdAt: '2026-07-14T09:00:00.000Z',
  id: 'favorite-1',
  listing: {
    createdAt: '2026-07-14T08:00:00.000Z',
    description: 'Instrumento que apunta hacia alternativas descartadas.',
    dimension: {
      id: 'dimension-1',
      name: 'Oraculo Norte',
      slug: 'oraculo-norte',
    },
    id: 'listing-1',
    imageUrls: ['/images/demo/brujula-decisiones.png'],
    price: {
      amount: 180,
      currencyCode: 'AUR',
    },
    rarity: 'RARE',
    seller: {
      displayName: 'Nadir Cronal',
      id: 'seller-1',
      username: 'nadir-cronal',
    },
    slug: 'brujula-de-decisiones-no-tomadas',
    status: 'PUBLISHED',
    title: 'Brujula de decisiones no tomadas',
  },
  user: userSession.user,
};

function renderFavoritesPage() {
  return render(
    <AppProviders>
      <FavoritesPage />
    </AppProviders>,
  );
}

describe('FavoritesPage', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    window.sessionStorage.clear();
  });

  it('asks for authentication before listing favorites', () => {
    renderFavoritesPage();

    expect(screen.getByText('Necesitas una identidad dimensional')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Iniciar sesion' })).toBeTruthy();
  });

  it('lists and removes favorites for the authenticated user', async () => {
    storeSession(userSession);
    let favorites = [favorite];
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.endsWith('/identity/me')) {
        return Response.json({ user: userSession.user });
      }

      if (url.endsWith('/favorites') && init?.method !== 'POST') {
        return Response.json(favorites);
      }

      if (
        url.endsWith('/favorites/brujula-de-decisiones-no-tomadas') &&
        init?.method === 'DELETE'
      ) {
        favorites = [];
        return new Response(null, { status: 204 });
      }

      return Response.json(
        { code: 'UNKNOWN_API_ERROR', message: 'No encontrado.' },
        { status: 404 },
      );
    });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    renderFavoritesPage();

    expect(await screen.findByText('Brujula de decisiones no tomadas')).toBeTruthy();
    expect(screen.getByText('1 favorito guardado')).toBeTruthy();

    await user.click(
      screen.getByRole('button', {
        name: 'Quitar Brujula de decisiones no tomadas de favoritos',
      }),
    );

    await waitFor(() => {
      expect(screen.getByText('Aun no hay favoritos')).toBeTruthy();
    });
    expect(
      fetchMock.mock.calls.some(
        ([url, init]) =>
          String(url).endsWith('/favorites/brujula-de-decisiones-no-tomadas') &&
          init?.method === 'DELETE',
      ),
    ).toBe(true);
  });
});
