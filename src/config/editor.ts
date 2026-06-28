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
  /** Heading levels offered in the toolbar (kept in sync with the editor schema). */
  headingLevels: [1, 2, 3],
} as const;

/** A single heading level the toolbar can apply. */
export type HeadingLevel = (typeof editor.headingLevels)[number];
