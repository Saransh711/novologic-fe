'use client';

import type { ReactNode } from 'react';
import { Observable } from 'rxjs';
import { ApolloLink, HttpLink } from '@apollo/client';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { ErrorLink } from '@apollo/client/link/error';
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from '@apollo/client-integration-nextjs';
import { env } from '@/config';

/** Operations that must never trigger a refresh (avoids recursion). */
const NON_REFRESHABLE_OPERATIONS = new Set(['Login', 'Logout', 'RefreshToken']);

/**
 * Single-flight refresh: if several requests fail with UNAUTHENTICATED at once,
 * they all await the same refresh round-trip instead of stampeding the server.
 * Calls the `refreshToken` mutation directly (bypassing the Apollo link chain)
 * so the rotated httpOnly cookies are set before any operation is retried.
 */
let refreshInFlight: Promise<boolean> | null = null;

function refreshSession(): Promise<boolean> {
  refreshInFlight ??= fetch(env.graphqlUrl, {
    method: 'POST',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query: 'mutation RefreshToken { refreshToken { id } }' }),
  })
    .then(async (response): Promise<boolean> => {
      if (!response.ok) return false;
      const body = (await response.json()) as { data?: { refreshToken?: { id?: string } | null } };
      return Boolean(body.data?.refreshToken?.id);
    })
    .catch((): boolean => false)
    .finally(() => {
      refreshInFlight = null;
    });
  return refreshInFlight;
}

function isUnauthenticated(error: unknown): boolean {
  return (
    CombinedGraphQLErrors.is(error) &&
    error.errors.some((graphQLError) => graphQLError.extensions?.code === 'UNAUTHENTICATED')
  );
}

/**
 * On an UNAUTHENTICATED error, transparently refreshes the access token once and
 * replays the original operation. A per-operation flag prevents infinite loops
 * when the refresh itself cannot restore the session.
 */
const refreshLink = new ErrorLink(({ error, operation, forward }) => {
  if (!isUnauthenticated(error)) return;
  if (NON_REFRESHABLE_OPERATIONS.has(operation.operationName ?? '')) return;

  const context = operation.getContext() as { authRetried?: boolean };
  if (context.authRetried) return;

  return new Observable((observer) => {
    refreshSession()
      .then((refreshed) => {
        if (!refreshed) {
          observer.error(error);
          return;
        }
        operation.setContext({ ...context, authRetried: true });
        forward(operation).subscribe(observer);
      })
      .catch((retryError: unknown) => observer.error(retryError));
  });
});

function makeClient() {
  const httpLink = new HttpLink({
    uri: env.graphqlUrl,
    // Send/receive the httpOnly auth cookies on every request.
    credentials: 'include',
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([refreshLink, httpLink]),
  });
}

export function ApolloWrapper({ children }: { children: ReactNode }) {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}
