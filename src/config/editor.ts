
export const editor = {
  autosaveDebounceMs: 1_500,
  autosaveMaxWaitMs: 10_000,
  maxVersions: 5,
  headingLevels: [1, 2, 3],
} as const;

export type HeadingLevel = (typeof editor.headingLevels)[number];
