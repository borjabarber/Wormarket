import type { AuthSession, AuthTokens } from '../model/auth-types';

const storageKey = 'wormarket.auth.session';
const storageChangeEvent = 'wormarket.auth.session.changed';
let cachedRawSession: string | null | undefined;
let cachedSession: AuthSession | null = null;

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function emitStorageChange(): void {
  if (isBrowser()) {
    window.dispatchEvent(new Event(storageChangeEvent));
  }
}

function isAuthSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;
  const user = record['user'];

  return (
    typeof record['accessToken'] === 'string' &&
    typeof record['refreshToken'] === 'string' &&
    Boolean(user) &&
    typeof user === 'object' &&
    !Array.isArray(user) &&
    typeof (user as Record<string, unknown>)['id'] === 'string' &&
    typeof (user as Record<string, unknown>)['username'] === 'string' &&
    typeof (user as Record<string, unknown>)['displayName'] === 'string' &&
    typeof (user as Record<string, unknown>)['role'] === 'string'
  );
}

export function readStoredSession(): AuthSession | null {
  if (!isBrowser()) {
    return null;
  }

  const rawSession = window.sessionStorage.getItem(storageKey);

  if (rawSession === cachedRawSession) {
    return cachedSession;
  }

  cachedRawSession = rawSession;

  if (!rawSession) {
    cachedSession = null;
    return null;
  }

  try {
    const parsedSession: unknown = JSON.parse(rawSession);
    cachedSession = isAuthSession(parsedSession) ? parsedSession : null;
    return cachedSession;
  } catch {
    cachedSession = null;
    return null;
  }
}

export function storeSession(session: AuthSession): void {
  if (isBrowser()) {
    window.sessionStorage.setItem(storageKey, JSON.stringify(session));
    emitStorageChange();
  }
}

export function updateStoredTokens(tokens: AuthTokens): AuthSession | null {
  const currentSession = readStoredSession();

  if (!currentSession) {
    return null;
  }

  const nextSession = {
    ...currentSession,
    ...tokens,
  };

  storeSession(nextSession);
  return nextSession;
}

export function clearStoredSession(): void {
  if (isBrowser()) {
    window.sessionStorage.removeItem(storageKey);
    emitStorageChange();
  }
}

export function subscribeToStoredSession(listener: () => void): () => void {
  if (!isBrowser()) {
    return () => undefined;
  }

  window.addEventListener(storageChangeEvent, listener);
  window.addEventListener('storage', listener);

  return () => {
    window.removeEventListener(storageChangeEvent, listener);
    window.removeEventListener('storage', listener);
  };
}
