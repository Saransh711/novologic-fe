import { HttpLink } from '@apollo/client';
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from '@apollo/client-integration-nextjs';
import { env } from '@/config';

/**
 * Apollo Client for React Server Components. `getClient`/`query` give RSCs a
 * request-scoped client, and `PreloadQuery` lets server components warm the
 * cache for client components below them.
 */
export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({ uri: env.graphqlUrl }),
  });
});
