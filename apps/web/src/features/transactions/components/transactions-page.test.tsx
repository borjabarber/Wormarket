import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { storeSession } from '../../auth/api/auth-storage';
import { AppProviders } from '../../auth/model/use-auth';
import type { ReviewSummary } from '../../reviews/model/review-types';
import type { TransactionSummary } from '../model/transaction-types';
import { TransactionsPage } from './transactions-page';

const userSession = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  user: {
    displayName: 'Lyra del Oraculo',
    id: 'seller-1',
    role: 'USER' as const,
    username: 'lyra-oraculo',
  },
};

const completedTransaction: TransactionSummary = {
  amount: {
    amount: 180,
    currencyCode: 'AUR',
  },
  buyer: {
    displayName: 'Nadir Cronal',
    id: 'buyer-1',
    username: 'nadir-cronal',
  },
  completedAt: '2026-07-14T10:30:00.000Z',
  createdAt: '2026-07-14T09:00:00.000Z',
  id: 'transaction-1',
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
    seller: userSession.user,
    slug: 'brujula-de-decisiones-no-tomadas',
    status: 'SOLD',
    title: 'Brujula de decisiones no tomadas',
  },
  offerId: 'offer-1',
  seller: userSession.user,
  status: 'COMPLETED',
  updatedAt: '2026-07-14T10:30:00.000Z',
};

const pendingTransaction: TransactionSummary = {
  ...completedTransaction,
  completedAt: null,
  status: 'PENDING_DELIVERY',
};

const reviewFixture: ReviewSummary = {
  comment: 'Comprador puntual incluso con dilatacion temporal.',
  createdAt: '2026-07-14T11:00:00.000Z',
  id: 'review-1',
  rating: 5,
  reviewee: completedTransaction.buyer,
  reviewer: userSession.user,
  transaction: {
    completedAt: completedTransaction.completedAt,
    id: completedTransaction.id,
    listing: {
      id: completedTransaction.listing.id,
      slug: completedTransaction.listing.slug,
      title: completedTransaction.listing.title,
    },
  },
  updatedAt: '2026-07-14T11:00:00.000Z',
};

function renderTransactionsPage() {
  return render(
    <AppProviders>
      <TransactionsPage />
    </AppProviders>,
  );
}

describe('TransactionsPage', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    window.sessionStorage.clear();
  });

  it('asks for authentication before listing transactions', () => {
    renderTransactionsPage();

    expect(screen.getByText('Necesitas una identidad dimensional')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Iniciar sesion' })).toBeTruthy();
  });

  it('completes pending transactions from the local API', async () => {
    storeSession(userSession);
    let transactions = [pendingTransaction];
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.endsWith('/identity/me')) {
        return Response.json({ user: userSession.user });
      }

      if (url.endsWith('/transactions') && init?.method !== 'POST') {
        return Response.json(transactions);
      }

      if (url.endsWith('/transactions/transaction-1/complete') && init?.method === 'POST') {
        transactions = [completedTransaction];
        return Response.json(completedTransaction);
      }

      return Response.json(
        { code: 'UNKNOWN_API_ERROR', message: 'No encontrado.' },
        { status: 404 },
      );
    });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    renderTransactionsPage();

    expect(await screen.findByText('Pendiente de entrega')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: 'Completar transaccion' }));

    await waitFor(() => {
      expect(
        fetchMock.mock.calls.some(
          ([url, init]) =>
            String(url).endsWith('/transactions/transaction-1/complete') && init?.method === 'POST',
        ),
      ).toBe(true);
    });
  });

  it('submits reviews for completed transactions', async () => {
    storeSession(userSession);
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.endsWith('/identity/me')) {
        return Response.json({ user: userSession.user });
      }

      if (url.endsWith('/transactions')) {
        return Response.json([completedTransaction]);
      }

      if (url.endsWith('/reviews') && init?.method === 'POST') {
        return Response.json(reviewFixture);
      }

      return Response.json(
        { code: 'UNKNOWN_API_ERROR', message: 'No encontrado.' },
        { status: 404 },
      );
    });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    renderTransactionsPage();

    await waitFor(() => {
      expect(screen.getAllByText('Completada').length).toBeGreaterThan(1);
    });
    expect(screen.getByLabelText('Puntuacion para Nadir Cronal')).toBeTruthy();

    await user.selectOptions(screen.getByLabelText('Puntuacion para Nadir Cronal'), '4');
    await user.type(screen.getByLabelText('Comentario'), 'Intercambio limpio y sin paradojas.');
    await user.click(screen.getByRole('button', { name: 'Enviar valoracion' }));

    await waitFor(() => {
      expect(
        fetchMock.mock.calls.some(([url, init]) => {
          if (!String(url).endsWith('/reviews') || init?.method !== 'POST') {
            return false;
          }

          return String(init.body).includes('"rating":4');
        }),
      ).toBe(true);
    });
    expect(await screen.findByText('Valoracion enviada a Nadir Cronal.')).toBeTruthy();
  });
});
