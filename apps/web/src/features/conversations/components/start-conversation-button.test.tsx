import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { storeSession } from '../../auth/api/auth-storage';
import { AppProviders } from '../../auth/model/use-auth';
import type { ListingSummary } from '../../listings/model/listing-types';
import type { ConversationSummary } from '../model/conversation-types';
import { StartConversationButton } from './start-conversation-button';

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

const conversation: ConversationSummary = {
  buyer: userSession.user,
  createdAt: '2026-07-14T09:00:00.000Z',
  id: 'conversation-1',
  lastMessage: null,
  listing,
  seller: listing.seller,
  updatedAt: '2026-07-14T09:00:00.000Z',
};

function renderStartConversationButton(targetListing = listing) {
  return render(
    <AppProviders>
      <StartConversationButton listing={targetListing} />
    </AppProviders>,
  );
}

describe('StartConversationButton', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    window.sessionStorage.clear();
  });

  it('links unauthenticated users to auth before opening chat', () => {
    renderStartConversationButton();

    expect(screen.getByRole('link', { name: 'Iniciar sesion para chatear' })).toBeTruthy();
  });

  it('creates a conversation and navigates to it with the authenticated token', async () => {
    storeSession(userSession);
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.endsWith('/identity/me')) {
        return Response.json({ user: userSession.user });
      }

      if (url.endsWith('/conversations') && init?.method === 'POST') {
        return Response.json(conversation);
      }

      return Response.json(
        { code: 'UNKNOWN_API_ERROR', message: 'No encontrado.' },
        { status: 404 },
      );
    });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    renderStartConversationButton();

    await user.click(await screen.findByRole('button', { name: 'Contactar vendedor' }));

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Abrir chat' })).toBeTruthy();
    });
    expect(screen.getByRole('link', { name: 'Abrir chat' }).getAttribute('href')).toBe(
      '/conversations/conversation-1',
    );
    expect(
      fetchMock.mock.calls.some(([url, init]) => {
        const headers = new Headers(init?.headers);
        const body = init?.body ? JSON.parse(String(init.body)) : {};

        return (
          String(url).endsWith('/conversations') &&
          init?.method === 'POST' &&
          headers.get('Authorization') === 'Bearer access-token' &&
          body.listingSlug === listing.slug
        );
      }),
    ).toBe(true);
  });
});
