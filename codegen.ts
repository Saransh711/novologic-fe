import type { CodegenConfig } from '@graphql-codegen/cli';

/**
 * GraphQL Code Generator configuration.
 *
 * Source of truth: `schema.graphql` (the backend's frozen contract) plus the
 * operation documents under `src/lib/graphql/operations`. Running `npm run
 * codegen` produces fully-typed operation/variable types and a
 * `TypedDocumentNode` per operation in `src/lib/graphql/generated/graphql.ts`.
 *
 * We intentionally generate `TypedDocumentNode`s (via `typed-document-node`)
 * rather than the legacy `typescript-react-apollo` hooks: that plugin targets
 * Apollo Client v3 and references types removed in v4 (`MutationFunction`,
 * `BaseMutationOptions`, v3 suspense option shapes). The typed documents feed a
 * thin, hand-written-but-fully-typed hooks layer in `src/lib/graphql/hooks.ts`,
 * so components still consume named, typed hooks and never write query strings.
 *
 * In codegen v6 `typescript-operations` is fully decoupled: it emits the
 * operation/fragment types plus only the Input and Enum types actually used by
 * the documents. Pairing it with the standalone `typescript` plugin in one file
 * would re-declare those inputs/enums and break compilation, so it runs alone.
 */
const config: CodegenConfig = {
  schema: 'schema.graphql',
  documents: ['src/lib/graphql/operations/**/*.graphql'],
  ignoreNoDocuments: true,
  generates: {
    'src/lib/graphql/generated/graphql.ts': {
      plugins: ['typescript-operations', 'typed-document-node'],
      config: {
        // Custom scalars -> precise TS types (no `any`, per project standards).
        scalars: {
          DateTime: 'string',
          // ProseMirror/Tiptap documents and other JSON payloads.
          JSON: 'Record<string, unknown>',
        },
        // String-literal unions for enums: zero runtime cost (also the v6 default).
        enumType: 'string-literal',
        // Always include __typename for correct cache normalization.
        nonOptionalTypename: true,
        // Use `import type` for type-only imports.
        useTypeImports: true,
        // Cleaner, predictable operation type names.
        dedupeOperationSuffix: true,
      },
    },
  },
};

export default config;
