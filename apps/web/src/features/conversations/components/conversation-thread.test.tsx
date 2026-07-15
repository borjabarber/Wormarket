import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { storeSession } from '../../auth/api/auth-storage';
import { AppProviders } from '../../auth/model/use-auth';
import type { ConversationMessage, ConversationSummary } from '../model/conversation-types';
import { ConversationThread } from './conversation-thread';

const socketDisconnectMock = vi.fn();
const socketEmitMock = vi.fn();
const socketOnMock = vi.fn();

vi.mock('../realtime/conversation-socket', () => ({
  createConversationSocket: () => ({
    disconnect: socketDisconnectMock,
    emit: socketEmitMock,
    on: socketOnMock,
  }),
}));

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

const seller = {
  displayName: 'Nadir Cronal',
  id: 'seller-1',
  username: 'nadir-cronal',
};

const conversation: ConversationSummary = {
  buyer: userSession.user,
  createdAt: '2026-07-14T09:00:00.000Z',
  id: 'conversation-1',
  lastMessage: null,
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
    seller,
    slug: 'brujula-de-decisiones-no-tomadas',
    status: 'PUBLISHED',
    title: 'Brujula de decisiones no tomadas',
  },
  seller,
  updatedAt: '2026-07-14T09:00:00.000Z',
};

const initialMessage: ConversationMessage = {
  content: 'El portal aguanta hasta medianoche.',
  conversationId: 'conversation-1',
  createdAt: '2026-07-14T10:00:00.000Z',
  id: 'message-1',
  readAt: '2026-07-14T10:01:00.000Z',
  sender: seller,
};

const createdMessage: ConversationMessage = {
  content: 'Perfecto, llego con una jaula temporal.',
  conversationId: 'conversation-1',
  createdAt: '2026-07-14T10:05:00.000Z',
  id: 'message-2',
  readAt: null,
  sender: userSession.user,
};

function renderConversationThread() {
  return render(
    <AppProviders>
      <ConversationThread conversationId="conversation-1" />
    </AppProviders>,
  );
}

describe('ConversationThread', () => {
  beforeEach(() => {
    socketDisconnectMock.mockClear();
    socketEmitMock.mockClear();
    socketOnMock.mockClear();
    window.sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    window.sessionStorage.clear();
  });

  it('asks for authentication before reading messages', () => {
    renderConversationThread();

    expect(screen.getByText('Necesitas una identidad dimensional')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Iniciar sesion' })).toBeTruthy();
  });

  it('loads messages and sends a new one with the authenticated token', async () => {
    storeSession(userSession);
    let messages = [initialMessage];
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.endsWith('/identity/me')) {
        return Response.json({ user: userSession.user });
      }

      if (url.endsWith('/conversations/conversation-1') && init?.method !== 'POST') {
        return Response.json(conversation);
      }

      if (url.endsWith('/conversations/conversation-1/messages') && init?.method !== 'POST') {
        return Response.json(messages);
      }

      if (url.endsWith('/conversations/conversation-1/messages') && init?.method === 'POST') {
        messages = [...messages, createdMessage];
        return Response.json(createdMessage);
      }

      return Response.json(
        { code: 'UNKNOWN_API_ERROR', message: 'No encontrado.' },
        { status: 404 },
      );
    });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    renderConversationThread();

    expect(await screen.findByText('Brujula de decisiones no tomadas')).toBeTruthy();
    expect(screen.getByText('El portal aguanta hasta medianoche.')).toBeTruthy();
    expect(socketEmitMock).toHaveBeenCalledWith('conversation:join', {
      conversationId: 'conversation-1',
    });

    await user.type(screen.getByLabelText('Mensaje'), createdMessage.content);
    await user.click(screen.getByRole('button', { name: 'Enviar mensaje' }));

    await waitFor(() => {
      expect(screen.getByText('Perfecto, llego con una jaula temporal.')).toBeTruthy();
    });
    expect(
      fetchMock.mock.calls.some(([url, init]) => {
        const headers = new Headers(init?.headers);
        const body = init?.body ? JSON.parse(String(init.body)) : {};

        return (
          String(url).endsWith('/conversations/conversation-1/messages') &&
          init?.method === 'POST' &&
          headers.get('Authorization') === 'Bearer access-token' &&
          body.content === createdMessage.content
        );
      }),
    ).toBe(true);
  });
});
