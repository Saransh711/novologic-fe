'use client';

import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useApolloClient } from '@apollo/client/react';
import { routes } from '@/config';
import { useLogoutMutation, useMeQuery, type MeQuery } from '@/lib/graphql';

export type AuthUser = MeQuery['me'];

interface AuthContextValue {
  /** The authenticated user, or `null` when signed out. */
  user: AuthUser | null;
  /** True while the initial session lookup is in flight. */
  loading: boolean;
  /** Re-runs the `me` query (e.g. immediately after a successful login). */
  refetch: () => Promise<unknown>;
  /** Revokes the session server-side, clears the cache, and routes to /login. */
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const client = useApolloClient();
  const [logoutMutation] = useLogoutMutation();

  // `errorPolicy: 'all'` keeps an UNAUTHENTICATED response from throwing — an
  // unauthenticated visitor simply has `data.me == null`. The Apollo error link
  // will already have attempted a silent token refresh before we get here.
  const { data, loading, refetch } = useMeQuery({
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  const logout = useCallback(async () => {
    try {
      await logoutMutation();
    } catch {
      // Even if the network call fails, drop local state and send to login.
    }
    await client.clearStore();
    router.replace(routes.login);
  }, [client, logoutMutation, router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: data?.me ?? null,
      loading,
      refetch: () => refetch(),
      logout,
    }),
    [data?.me, loading, refetch, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }
  return context;
}
