'use client';

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import {
  createContext,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

import { authClient } from '../api/auth-client';
import {
  clearStoredSession,
  readStoredSession,
  storeSession,
  subscribeToStoredSession,
} from '../api/auth-storage';
import type {
  AuthSession,
  AuthenticatedUser,
  LoginIdentityInput,
  RegisterIdentityInput,
} from './auth-types';
import { AuthApiError } from './auth-types';

type AuthContextValue = {
  isAuthenticated: boolean;
  isCheckingSession: boolean;
  login: (input: LoginIdentityInput) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<boolean>;
  register: (input: RegisterIdentityInput) => Promise<void>;
  session: AuthSession | null;
  user: AuthenticatedUser | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: 60_000,
      },
    },
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useSyncExternalStore(subscribeToStoredSession, readStoredSession, () => null);

  const currentIdentityQuery = useQuery({
    enabled: Boolean(session?.accessToken),
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new AuthApiError('INVALID_AUTHORIZATION_HEADER', 'La sesion no esta iniciada.');
      }

      return authClient.getMe(session.accessToken);
    },
    queryKey: ['identity', 'me', session?.accessToken],
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(session),
      isCheckingSession: currentIdentityQuery.isFetching,
      async login(input) {
        const nextSession = await authClient.login(input);
        storeSession(nextSession);
      },
      async logout() {
        const currentAccessToken = session?.accessToken;
        clearStoredSession();

        if (currentAccessToken) {
          try {
            await authClient.logout(currentAccessToken);
          } catch {
            // Local logout should still clear the browser session if the API is unavailable.
          }
        }
      },
      async refresh() {
        if (!session?.refreshToken) {
          return false;
        }

        try {
          const nextSession = await authClient.refresh(session.refreshToken);
          storeSession(nextSession);
          return true;
        } catch {
          clearStoredSession();
          return false;
        }
      },
      async register(input) {
        const nextSession = await authClient.register(input);
        storeSession(nextSession);
      },
      session,
      user: currentIdentityQuery.data?.user ?? session?.user ?? null,
    }),
    [currentIdentityQuery.data?.user, currentIdentityQuery.isFetching, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
}
