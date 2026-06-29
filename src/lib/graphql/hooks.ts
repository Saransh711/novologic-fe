/**
 * Typed Apollo hooks — the ONLY sanctioned way for components to talk to the
 * GraphQL API. Every hook is a thin wrapper around an Apollo Client v4 React
 * hook bound to a generated `TypedDocumentNode`, so the data, variable, and
 * result types all flow from `schema.graphql` automatically. Components must
 * never call `useQuery`/`useMutation` with an inline query string — import a
 * hook from here (re-exported via `@/lib/graphql`) instead.
 *
 * Regenerate the underlying documents/types with `npm run codegen` whenever the
 * backend contract changes.
 */
import { useMutation, useQuery } from '@apollo/client/react';
import {
  DeleteFileDocument,
  type DeleteFileMutation,
  type DeleteFileMutationVariables,
  HealthDocument,
  type HealthQuery,
  type HealthQueryVariables,
  LoginDocument,
  type LoginMutation,
  type LoginMutationVariables,
  LogoutDocument,
  type LogoutMutation,
  type LogoutMutationVariables,
  MeDocument,
  type MeQuery,
  type MeQueryVariables,
  ProjectsDocument,
  type ProjectsQuery,
  type ProjectsQueryVariables,
  RefreshTokenDocument,
  type RefreshTokenMutation,
  type RefreshTokenMutationVariables,
  RestoreWorkbookVersionDocument,
  type RestoreWorkbookVersionMutation,
  type RestoreWorkbookVersionMutationVariables,
  SaveWorkbookDocument,
  type SaveWorkbookMutation,
  type SaveWorkbookMutationVariables,
  UploadFileMetadataDocument,
  type UploadFileMetadataMutation,
  type UploadFileMetadataMutationVariables,
  WorkbookDocument,
  type WorkbookQuery,
  type WorkbookQueryVariables,
  WorkbookVersionsDocument,
  type WorkbookVersionsQuery,
  type WorkbookVersionsQueryVariables,
} from './generated/graphql';

/* -------------------------------------------------------------------------- */
/*  Queries                                                                   */
/* -------------------------------------------------------------------------- */

/** Lists projects, oldest first, with pagination (variables optional). */
export function useProjectsQuery(
  options?: useQuery.Options<ProjectsQuery, ProjectsQueryVariables>,
) {
  return useQuery(ProjectsDocument, options);
}

/**
 * Reads the workbook for a project. `data.workbook` is `null` when the project
 * has no workbook yet — that is an empty state, not an error.
 */
export function useWorkbookQuery(options: useQuery.Options<WorkbookQuery, WorkbookQueryVariables>) {
  return useQuery(WorkbookDocument, options);
}

/** Lists the most recent archived versions of a workbook, newest first. */
export function useWorkbookVersionsQuery(
  options: useQuery.Options<WorkbookVersionsQuery, WorkbookVersionsQueryVariables>,
) {
  return useQuery(WorkbookVersionsDocument, options);
}

/** Liveness/readiness probe for a status indicator. */
export function useHealthQuery(options?: useQuery.Options<HealthQuery, HealthQueryVariables>) {
  return useQuery(HealthDocument, options);
}

/** Returns the currently authenticated user, or errors with UNAUTHENTICATED. */
export function useMeQuery(options?: useQuery.Options<MeQuery, MeQueryVariables>) {
  return useQuery(MeDocument, options);
}

/* -------------------------------------------------------------------------- */
/*  Mutations                                                                 */
/* -------------------------------------------------------------------------- */

/** Authenticates with email + password; the server sets httpOnly auth cookies. */
export function useLoginMutation(
  options?: useMutation.Options<LoginMutation, LoginMutationVariables>,
) {
  return useMutation(LoginDocument, options);
}

/** Revokes the current session and clears the auth cookies. */
export function useLogoutMutation(
  options?: useMutation.Options<LogoutMutation, LogoutMutationVariables>,
) {
  return useMutation(LogoutDocument, options);
}

/** Rotates the refresh token and re-issues the access token cookie. */
export function useRefreshTokenMutation(
  options?: useMutation.Options<RefreshTokenMutation, RefreshTokenMutationVariables>,
) {
  return useMutation(RefreshTokenDocument, options);
}

/** Creates or overwrites a project's workbook, archiving the previous content. */
export function useSaveWorkbookMutation(
  options?: useMutation.Options<SaveWorkbookMutation, SaveWorkbookMutationVariables>,
) {
  return useMutation(SaveWorkbookDocument, options);
}

/** Restores a workbook to a previously archived version. */
export function useRestoreWorkbookVersionMutation(
  options?: useMutation.Options<
    RestoreWorkbookVersionMutation,
    RestoreWorkbookVersionMutationVariables
  >,
) {
  return useMutation(RestoreWorkbookVersionDocument, options);
}

/** Records metadata for a binary already uploaded via `POST /files/upload`. */
export function useUploadFileMetadataMutation(
  options?: useMutation.Options<UploadFileMetadataMutation, UploadFileMetadataMutationVariables>,
) {
  return useMutation(UploadFileMetadataDocument, options);
}

/** Deletes a file's metadata record and its stored binary. */
export function useDeleteFileMutation(
  options?: useMutation.Options<DeleteFileMutation, DeleteFileMutationVariables>,
) {
  return useMutation(DeleteFileDocument, options);
}
