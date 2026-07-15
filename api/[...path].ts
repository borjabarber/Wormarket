import type { IncomingMessage, ServerResponse } from 'node:http';

import { createNestApplication } from '../apps/api/src/bootstrap';

type ServerlessHandler = (request: IncomingMessage, response: ServerResponse) => void;

let cachedHandler: Promise<ServerlessHandler> | undefined;

export function stripApiPrefix(request: IncomingMessage): void {
  const originalUrl = request.url ?? '/';
  const parsedUrl = new URL(originalUrl, 'http://wormarket.local');
  const rewrittenPath = parsedUrl.searchParams.get('path');

  if (parsedUrl.pathname === '/api' && rewrittenPath) {
    parsedUrl.searchParams.delete('path');

    const queryString = parsedUrl.searchParams.toString();
    request.url = `/${rewrittenPath.replace(/^\/+/u, '')}${queryString ? `?${queryString}` : ''}`;
    return;
  }

  if (originalUrl === '/api') {
    request.url = '/';
    return;
  }

  if (originalUrl.startsWith('/api/')) {
    request.url = originalUrl.slice('/api'.length) || '/';
  }
}

async function getHandler(): Promise<ServerlessHandler> {
  cachedHandler ??= createNestApplication().then(async (app) => {
    await app.init();

    return app.getHttpAdapter().getInstance() as ServerlessHandler;
  });

  return cachedHandler;
}

export default async function handler(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  stripApiPrefix(request);

  const nestHandler = await getHandler();
  nestHandler(request, response);
}
