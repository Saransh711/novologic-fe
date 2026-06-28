/**
 * Runtime environment configuration. Public values are read from
 * `NEXT_PUBLIC_*` variables so they are available in the browser, with
 * sensible local-development defaults that point at the workbook API.
 */
function withDefault(value: string | undefined, fallback: string): string {
  return value && value.trim().length > 0 ? value.trim() : fallback;
}

export const env = {
  /** Absolute URL of the GraphQL endpoint (required to be absolute for SSR). */
  graphqlUrl: withDefault(process.env.NEXT_PUBLIC_GRAPHQL_URL, 'http://localhost:3000/graphql'),
  /** Base URL of the API origin, used to resolve served upload URLs. */
  apiBaseUrl: withDefault(process.env.NEXT_PUBLIC_API_BASE_URL, 'http://localhost:3000'),
} as const;
