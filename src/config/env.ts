
function withDefault(value: string | undefined, fallback: string): string {
  return value && value.trim().length > 0 ? value.trim() : fallback;
}

export const env = {
  graphqlUrl: withDefault(process.env.NEXT_PUBLIC_GRAPHQL_URL, 'http://localhost:3000/graphql'),
  apiBaseUrl: withDefault(process.env.NEXT_PUBLIC_API_BASE_URL, 'http://localhost:3000'),
} as const;
