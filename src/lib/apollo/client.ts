import { cookies } from 'next/headers';
import { ApolloLink, HttpLink } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from '@apollo/client-integration-nextjs';
import { env } from '@/config';

/**
 * Server-side (RSC) Apollo client. Unlike the browser, server fetches do not
 * automatically carry the incoming request's cookies, so this link forwards
 * them explicitly — letting authenticated queries run during SSR/RSC.
 */
const forwardCookiesLink = new SetContextLink(async (prevContext) => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ');

  return {
    headers: {
      ...(prevContext.headers as Record<string, string> | undefined),
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
  };
});

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([
      forwardCookiesLink,
      new HttpLink({ uri: env.graphqlUrl, credentials: 'include' }),
    ]),
  });
});
