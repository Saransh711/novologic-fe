'use client';

import type { ReactNode } from 'react';
import { HttpLink } from '@apollo/client';
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from '@apollo/client-integration-nextjs';
import { env } from '@/config';

/**
 * Builds a fresh Apollo Client per request on the server and a singleton in the
 * browser. `ApolloNextAppProvider` ensures every client component shares one
 * instance and that SSR-rendered data hydrates without refetching.
 */
function makeClient() {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({ uri: env.graphqlUrl }),
  });
}

export function ApolloWrapper({ children }: { children: ReactNode }) {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}
