import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { storeSession } from '../../auth/api/auth-storage';
import { AppProviders } from '../../auth/model/use-auth';
import type { FavoriteSummary } from '../model/favorite-types';
import { FavoriteButton } from './favorite-button';

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
    imageUrls: [],
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

function renderFavoriteButton() {
  return render(
    <AppProviders>
      <FavoriteButton
        listingSlug="brujula-de-decisiones-no-tomadas"
        listingTitle="Brujula de decisiones no tomadas"
      />
    </AppProviders>,
  );
}

describe('FavoriteButton', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    window.sessionStorage.clear();
  });

  it('links unauthenticated users to the auth screen', () => {
    renderFavoriteButton();

    expect(
      screen.getByRole('link', {
        name: 'Iniciar sesion para guardar Brujula de decisiones no tomadas',
      }),
    ).toBeTruthy();
  });

  it('adds a favorite with the authenticated access token', async () => {
    storeSession(userSession);
    let favorites: FavoriteSummary[] = [];
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.endsWith('/identity/me')) {
        return Response.json({ user: userSession.user });
      }

      if (url.endsWith('/favorites') && init?.method !== 'POST') {
        return Response.json(favorites);
      }

      if (url.endsWith('/favorites/brujula-de-decisiones-no-tomadas') && init?.method === 'POST') {
        favorites = [favorite];
        return Response.json(favorite);
      }

      return Response.json(
        { code: 'UNKNOWN_API_ERROR', message: 'No encontrado.' },
        { status: 404 },
      );
    });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    renderFavoriteButton();

    const button = await screen.findByRole('button', {
      name: 'Guardar Brujula de decisiones no tomadas en favoritos',
    });
    await user.click(button);

    await waitFor(() => {
      expect(
        fetchMock.mock.calls.some(
          ([url, init]) =>
            String(url).endsWith('/favorites/brujula-de-decisiones-no-tomadas') &&
            init?.method === 'POST' &&
            new Headers(init.headers).get('Authorization') === 'Bearer access-token',
        ),
      ).toBe(true);
    });
  });
});
