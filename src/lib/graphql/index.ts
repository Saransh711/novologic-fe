/**
 * Public entry point for the GraphQL data layer. Import typed hooks and types
 * from `@/lib/graphql` — never reach into `./generated` or write query strings
 * in components.
 */
export * from './hooks';

// Re-export generated operation/variable/input types and `TypedDocumentNode`s
// for advanced use (e.g. cache updates, `refetchQueries`, server-side prefetch
// via the RSC Apollo client). Raw documents stay available, query strings do not.
export * from './generated/graphql';
