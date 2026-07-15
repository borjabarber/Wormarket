import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { storeSession } from '../../auth/api/auth-storage';
import { AppProviders } from '../../auth/model/use-auth';
import type { ConversationSummary } from '../model/conversation-types';
import { ConversationsPage } from './conversations-page';

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

const conversation: ConversationSummary = {
  buyer: userSession.user,
  createdAt: '2026-07-14T09:00:00.000Z',
  id: 'conversation-1',
  lastMessage: {
    content: 'El portal aguanta hasta medianoche.',
    conversationId: 'conversation-1',
    createdAt: '2026-07-14T10:00:00.000Z',
    id: 'message-1',
    readAt: null,
    sender: {
      displayName: 'Nadir Cronal',
      id: 'seller-1',
      username: 'nadir-cronal',
    },
  },
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
  seller: {
    displayName: 'Nadir Cronal',
    id: 'seller-1',
    username: 'nadir-cronal',
  },
  updatedAt: '2026-07-14T10:00:00.000Z',
};

function renderConversationsPage() {
  return render(
    <AppProviders>
      <ConversationsPage />
    </AppProviders>,
  );
}

describe('ConversationsPage', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    window.sessionStorage.clear();
  });

  it('asks for authentication before listing conversations', () => {
    renderConversationsPage();

    expect(screen.getByText('Necesitas una identidad dimensional')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Iniciar sesion' })).toBeTruthy();
  });

  it('lists authenticated conversations from the local API', async () => {
    storeSession(userSession);
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);

      if (url.endsWith('/identity/me')) {
        return Response.json({ user: userSession.user });
      }

      if (url.endsWith('/conversations')) {
        return Response.json([conversation]);
      }

      return Response.json(
        { code: 'UNKNOWN_API_ERROR', message: 'No encontrado.' },
        { status: 404 },
      );
    });
    vi.stubGlobal('fetch', fetchMock);

    renderConversationsPage();

    expect(await screen.findByText('Brujula de decisiones no tomadas')).toBeTruthy();
    expect(screen.getByText('Con Nadir Cronal · Oraculo Norte')).toBeTruthy();
    expect(screen.getByText('El portal aguanta hasta medianoche.')).toBeTruthy();
    expect(screen.getByText('Nuevo')).toBeTruthy();
    expect(screen.getByRole('link', { name: /Brujula de decisiones no tomadas/ })).toBeTruthy();
  });
});
