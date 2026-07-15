import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { storeSession } from '../../auth/api/auth-storage';
import { AppProviders } from '../../auth/model/use-auth';
import type { ListingSummary } from '../../listings/model/listing-types';
import type { OfferSummary } from '../model/offer-types';
import { ListingOffersPanel } from './listing-offers-panel';

const sellerSession = {
  accessToken: 'seller-token',
  refreshToken: 'refresh-token',
  user: {
    displayName: 'Nadir Cronal',
    id: 'seller-1',
    role: 'USER' as const,
    username: 'nadir-cronal',
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
  seller: sellerSession.user,
  slug: 'brujula-de-decisiones-no-tomadas',
  status: 'PUBLISHED',
  title: 'Brujula de decisiones no tomadas',
};

const offer: OfferSummary = {
  amount: {
    amount: 210,
    currencyCode: 'AUR',
  },
  buyer: {
    displayName: 'Lyra del Oraculo',
    id: 'user-1',
    username: 'lyra-oraculo',
  },
  createdAt: '2026-07-14T09:00:00.000Z',
  id: 'offer-1',
  listing,
  message: 'Incluyo transporte por portal estable.',
  status: 'PENDING',
  updatedAt: '2026-07-14T09:00:00.000Z',
};

function renderListingOffersPanel(targetListing = listing) {
  return render(
    <AppProviders>
      <ListingOffersPanel listing={targetListing} />
    </AppProviders>,
  );
}

describe('ListingOffersPanel', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    window.sessionStorage.clear();
  });

  it('stays hidden for non-owner users', () => {
    renderListingOffersPanel();

    expect(screen.queryByText('Ofertas recibidas')).toBeNull();
  });

  it('lets the listing owner accept a pending offer', async () => {
    storeSession(sellerSession);
    let offers = [offer];
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.endsWith('/identity/me')) {
        return Response.json({ user: sellerSession.user });
      }

      if (url.endsWith('/listings/brujula-de-decisiones-no-tomadas/offers')) {
        return Response.json(offers);
      }

      if (url.endsWith('/offers/offer-1/accept') && init?.method === 'POST') {
        const acceptedOffer: OfferSummary = { ...offer, status: 'ACCEPTED' };
        offers = [acceptedOffer];
        return Response.json(acceptedOffer);
      }

      return Response.json(
        { code: 'UNKNOWN_API_ERROR', message: 'No encontrado.' },
        { status: 404 },
      );
    });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    renderListingOffersPanel();

    expect(await screen.findByText('Ofertas recibidas')).toBeTruthy();
    expect(screen.getByText('Lyra del Oraculo · 14 de julio de 2026')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: 'Aceptar' }));

    await waitFor(() => {
      expect(screen.getByText('Aceptada')).toBeTruthy();
    });
    expect(
      fetchMock.mock.calls.some(
        ([url, init]) =>
          String(url).endsWith('/offers/offer-1/accept') &&
          init?.method === 'POST' &&
          new Headers(init.headers).get('Authorization') === 'Bearer seller-token',
      ),
    ).toBe(true);
  });
});
