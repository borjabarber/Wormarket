import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { storeSession } from '../../auth/api/auth-storage';
import { AppProviders } from '../../auth/model/use-auth';
import type { OfferSummary } from '../model/offer-types';
import { OffersPage } from './offers-page';

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

const offer: OfferSummary = {
  amount: {
    amount: 210,
    currencyCode: 'AUR',
  },
  buyer: userSession.user,
  createdAt: '2026-07-14T09:00:00.000Z',
  id: 'offer-1',
  listing: {
    dimension: {
      id: 'dimension-1',
      name: 'Oraculo Norte',
      slug: 'oraculo-norte',
    },
    id: 'listing-1',
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
  message: 'Incluyo transporte por portal estable.',
  status: 'PENDING',
  updatedAt: '2026-07-14T09:00:00.000Z',
};

function renderOffersPage() {
  return render(
    <AppProviders>
      <OffersPage />
    </AppProviders>,
  );
}

describe('OffersPage', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    window.sessionStorage.clear();
  });

  it('asks for authentication before listing offers', () => {
    renderOffersPage();

    expect(screen.getByText('Necesitas una identidad dimensional')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Iniciar sesion' })).toBeTruthy();
  });

  it('lists and cancels pending offers for the authenticated user', async () => {
    storeSession(userSession);
    let offers = [offer];
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.endsWith('/identity/me')) {
        return Response.json({ user: userSession.user });
      }

      if (url.endsWith('/offers') && init?.method !== 'POST') {
        return Response.json(offers);
      }

      if (url.endsWith('/offers/offer-1/cancel') && init?.method === 'POST') {
        const cancelledOffer: OfferSummary = { ...offer, status: 'CANCELLED' };
        offers = [cancelledOffer];
        return Response.json(cancelledOffer);
      }

      return Response.json(
        { code: 'UNKNOWN_API_ERROR', message: 'No encontrado.' },
        { status: 404 },
      );
    });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    renderOffersPage();

    expect(await screen.findByText('Brujula de decisiones no tomadas')).toBeTruthy();
    expect(screen.getByText('1 oferta enviada')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    await waitFor(() => {
      expect(screen.getByText('Cancelada')).toBeTruthy();
    });
    expect(
      fetchMock.mock.calls.some(
        ([url, init]) =>
          String(url).endsWith('/offers/offer-1/cancel') &&
          init?.method === 'POST' &&
          new Headers(init.headers).get('Authorization') === 'Bearer access-token',
      ),
    ).toBe(true);
  });
});
