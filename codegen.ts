import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'schema.graphql',
  documents: ['src/lib/graphql/operations/**/*.graphql'],
  ignoreNoDocuments: true,
  generates: {
    'src/lib/graphql/generated/graphql.ts': {
      plugins: ['typescript-operations', 'typed-document-node'],
      config: {
        scalars: {
          DateTime: 'string',
          JSON: 'Record<string, unknown>',
        },
        enumType: 'string-literal',
        nonOptionalTypename: true,
        useTypeImports: true,
        dedupeOperationSuffix: true,
      },
    },
  },
};

export default config;
