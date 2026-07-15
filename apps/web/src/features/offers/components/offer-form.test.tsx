import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { storeSession } from '../../auth/api/auth-storage';
import { AppProviders } from '../../auth/model/use-auth';
import type { ListingSummary } from '../../listings/model/listing-types';
import type { OfferSummary } from '../model/offer-types';
import { OfferForm } from './offer-form';

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

const listing: ListingSummary = {
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
};

const offer: OfferSummary = {
  amount: {
    amount: 210,
    currencyCode: 'AUR',
  },
  buyer: userSession.user,
  createdAt: '2026-07-14T09:00:00.000Z',
  id: 'offer-1',
  listing,
  message: 'Incluyo transporte por portal estable.',
  status: 'PENDING',
  updatedAt: '2026-07-14T09:00:00.000Z',
};

function renderOfferForm(targetListing = listing) {
  return render(
    <AppProviders>
      <OfferForm listing={targetListing} />
    </AppProviders>,
  );
}

describe('OfferForm', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    window.sessionStorage.clear();
  });

  it('asks unauthenticated users to sign in before offering', () => {
    renderOfferForm();

    expect(screen.getByText('Inicia sesion para ofertar')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Iniciar sesion' })).toBeTruthy();
  });

  it('creates an offer with the authenticated access token', async () => {
    storeSession(userSession);
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.endsWith('/identity/me')) {
        return Response.json({ user: userSession.user });
      }

      if (url.endsWith('/offers') && init?.method === 'POST') {
        return Response.json(offer);
      }

      return Response.json(
        { code: 'UNKNOWN_API_ERROR', message: 'No encontrado.' },
        { status: 404 },
      );
    });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    renderOfferForm();

    await user.clear(await screen.findByLabelText('Importe'));
    await user.type(screen.getByLabelText('Importe'), '210');
    await user.type(screen.getByLabelText('Mensaje al vendedor'), offer.message ?? '');
    await user.click(screen.getByRole('button', { name: 'Enviar oferta' }));

    await waitFor(() => {
      expect(screen.getByText(/Oferta enviada por 210 AUR/)).toBeTruthy();
    });
    expect(
      fetchMock.mock.calls.some(([url, init]) => {
        const headers = new Headers(init?.headers);
        const body = init?.body ? JSON.parse(String(init.body)) : {};

        return (
          String(url).endsWith('/offers') &&
          init?.method === 'POST' &&
          headers.get('Authorization') === 'Bearer access-token' &&
          body.listingSlug === listing.slug &&
          body.amount === 210 &&
          body.message === offer.message
        );
      }),
    ).toBe(true);
  });
});
