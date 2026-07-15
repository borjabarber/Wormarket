import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { storeSession } from '../../auth/api/auth-storage';
import { AppProviders } from '../../auth/model/use-auth';
import type { ReportSummary } from '../model/moderation-types';
import { ModerationPage } from './moderation-page';

const moderatorSession = {
  accessToken: 'moderator-token',
  refreshToken: 'refresh-token',
  user: {
    displayName: 'Mara Moderadora',
    id: 'moderator-1',
    role: 'MODERATOR' as const,
    username: 'mara-moderadora',
  },
};

const userSession = {
  accessToken: 'user-token',
  refreshToken: 'refresh-token',
  user: {
    displayName: 'Lyra del Oraculo',
    id: 'user-1',
    role: 'USER' as const,
    username: 'lyra-oraculo',
  },
};

const pendingListingReport: ReportSummary = {
  createdAt: '2026-07-14T10:00:00.000Z',
  description: 'La brujula parece manipular decisiones de compradores sin consentimiento.',
  id: 'report-1',
  listing: {
    id: 'listing-1',
    slug: 'brujula-de-decisiones-no-tomadas',
    status: 'PUBLISHED',
    title: 'Brujula de decisiones no tomadas',
  },
  reason: 'FORBIDDEN_OBJECT',
  reportedUser: null,
  reporter: {
    displayName: 'Nadir Cronal',
    id: 'user-2',
    username: 'nadir-cronal',
  },
  resolution: null,
  resolvedAt: null,
  resolvedBy: null,
  status: 'PENDING',
  targetType: 'LISTING',
  updatedAt: '2026-07-14T10:00:00.000Z',
};

const pendingUserReport: ReportSummary = {
  ...pendingListingReport,
  description: 'El usuario esta enviando spam dimensional a todas las conversaciones.',
  id: 'report-2',
  listing: null,
  reason: 'SPAM',
  reportedUser: {
    displayName: 'Io Horizonte',
    id: 'user-3',
    username: 'io-horizonte',
  },
  targetType: 'USER',
};

function renderModerationPage() {
  return render(
    <AppProviders>
      <ModerationPage />
    </AppProviders>,
  );
}

describe('ModerationPage', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    window.sessionStorage.clear();
  });

  it('asks for authentication before opening moderation', () => {
    renderModerationPage();

    expect(screen.getByText('Necesitas una identidad dimensional')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Iniciar sesion' })).toBeTruthy();
  });

  it('blocks regular users from the moderation queue', async () => {
    storeSession(userSession);
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        if (String(input).endsWith('/identity/me')) {
          return Response.json({ user: userSession.user });
        }

        return Response.json([]);
      }),
    );

    renderModerationPage();

    expect(await screen.findByText('Panel reservado')).toBeTruthy();
    expect(screen.getByText(/Solo moderadores y administradores/)).toBeTruthy();
  });

  it('lists reports and resolves one', async () => {
    storeSession(moderatorSession);
    let reports = [pendingListingReport, pendingUserReport];
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.endsWith('/identity/me')) {
        return Response.json({ user: moderatorSession.user });
      }

      if (url.endsWith('/moderation/reports') && init?.method !== 'POST') {
        return Response.json(reports);
      }

      if (url.endsWith('/moderation/reports/report-1/resolve') && init?.method === 'POST') {
        reports = [
          {
            ...pendingListingReport,
            resolution: 'Objeto retirado de la cola dimensional.',
            resolvedAt: '2026-07-14T10:30:00.000Z',
            resolvedBy: moderatorSession.user,
            status: 'RESOLVED',
          },
          pendingUserReport,
        ];
        return Response.json(reports[0]);
      }

      return Response.json(
        { code: 'UNKNOWN_API_ERROR', message: 'No encontrado.' },
        { status: 404 },
      );
    });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    renderModerationPage();

    expect(await screen.findByText('Brujula de decisiones no tomadas')).toBeTruthy();
    expect(screen.getByText('Io Horizonte')).toBeTruthy();
    expect(screen.getByText('2 denuncias pendientes')).toBeTruthy();

    const resolutionFields = screen.getAllByLabelText('Resolucion interna');
    const resolveButtons = screen.getAllByRole('button', { name: 'Marcar como resuelta' });

    expect(resolutionFields.length).toBeGreaterThan(0);
    expect(resolveButtons.length).toBeGreaterThan(0);

    await user.type(resolutionFields[0] as HTMLElement, 'Objeto retirado de la cola dimensional.');
    await user.click(resolveButtons[0] as HTMLElement);

    await waitFor(() => {
      expect(screen.getByText('1 denuncia pendiente')).toBeTruthy();
    });
    expect(
      fetchMock.mock.calls.some(([url, init]) => {
        const headers = new Headers(init?.headers);

        return (
          String(url).endsWith('/moderation/reports/report-1/resolve') &&
          init?.method === 'POST' &&
          headers.get('Authorization') === 'Bearer moderator-token' &&
          String(init?.body).includes('"status":"RESOLVED"')
        );
      }),
    ).toBe(true);
  });

  it('blocks reported users from the queue', async () => {
    storeSession(moderatorSession);
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.endsWith('/identity/me')) {
        return Response.json({ user: moderatorSession.user });
      }

      if (url.endsWith('/moderation/reports') && init?.method !== 'POST') {
        return Response.json([pendingUserReport]);
      }

      if (url.endsWith('/moderation/users/io-horizonte/block') && init?.method === 'POST') {
        return Response.json({
          status: 'BLOCKED',
          userId: 'user-3',
          username: 'io-horizonte',
        });
      }

      return Response.json(
        { code: 'UNKNOWN_API_ERROR', message: 'No encontrado.' },
        { status: 404 },
      );
    });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    renderModerationPage();

    expect(await screen.findByText('Io Horizonte')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: 'Bloquear usuario' }));

    await waitFor(() => {
      expect(
        fetchMock.mock.calls.some(([url, init]) => {
          const headers = new Headers(init?.headers);

          return (
            String(url).endsWith('/moderation/users/io-horizonte/block') &&
            init?.method === 'POST' &&
            headers.get('Authorization') === 'Bearer moderator-token'
          );
        }),
      ).toBe(true);
    });
  });
});
