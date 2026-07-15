import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { storeSession } from '../../auth/api/auth-storage';
import { AppProviders } from '../../auth/model/use-auth';
import { ReportForm } from './report-form';

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

function renderReportForm() {
  return render(
    <AppProviders>
      <ReportForm
        targetId="brujula-de-decisiones-no-tomadas"
        targetLabel="el anuncio Brujula de decisiones no tomadas"
        targetType="LISTING"
      />
    </AppProviders>,
  );
}

describe('ReportForm', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    window.sessionStorage.clear();
  });

  it('asks for authentication before reporting', () => {
    renderReportForm();

    expect(screen.getByRole('link', { name: 'Iniciar sesion para denunciar' })).toBeTruthy();
  });

  it('submits an authenticated listing report', async () => {
    storeSession(userSession);
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.endsWith('/identity/me')) {
        return Response.json({ user: userSession.user });
      }

      if (
        url.endsWith('/moderation/reports/listings/brujula-de-decisiones-no-tomadas') &&
        init?.method === 'POST'
      ) {
        return Response.json({
          createdAt: '2026-07-14T10:00:00.000Z',
          description: 'El objeto parece prohibido por el pacto dimensional local.',
          id: 'report-1',
          listing: null,
          reason: 'FORBIDDEN_OBJECT',
          reportedUser: null,
          reporter: userSession.user,
          resolution: null,
          resolvedAt: null,
          resolvedBy: null,
          status: 'PENDING',
          targetType: 'LISTING',
          updatedAt: '2026-07-14T10:00:00.000Z',
        });
      }

      return Response.json(
        { code: 'UNKNOWN_API_ERROR', message: 'No encontrado.' },
        { status: 404 },
      );
    });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();

    renderReportForm();

    await user.selectOptions(screen.getByLabelText('Motivo'), 'FORBIDDEN_OBJECT');
    await user.type(
      screen.getByLabelText('Descripcion'),
      'El objeto parece prohibido por el pacto dimensional local.',
    );
    await user.click(screen.getByRole('button', { name: 'Enviar denuncia' }));

    expect(await screen.findByText('Denuncia enviada a la cola de moderacion.')).toBeTruthy();
    await waitFor(() => {
      expect(
        fetchMock.mock.calls.some(([url, init]) => {
          const headers = new Headers(init?.headers);

          return (
            String(url).endsWith('/moderation/reports/listings/brujula-de-decisiones-no-tomadas') &&
            init?.method === 'POST' &&
            headers.get('Authorization') === 'Bearer access-token' &&
            String(init?.body).includes('"reason":"FORBIDDEN_OBJECT"')
          );
        }),
      ).toBe(true);
    });
  });
});
