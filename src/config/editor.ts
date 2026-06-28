/**
 * Workbook editor behaviour. `maxVersions` mirrors the API's
 * `MAX_WORKBOOK_VERSIONS` so the client and server agree on history depth.
 */
export const editor = {
  /** Idle delay before an autosave fires after the last keystroke. */
  autosaveDebounceMs: 1_500,
  /** Hard ceiling between autosaves while the user keeps typing. */
  autosaveMaxWaitMs: 10_000,
  /** Number of historical snapshots retained per workbook (server-enforced). */
  maxVersions: 5,
} as const;
