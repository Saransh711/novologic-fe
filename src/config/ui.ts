
export const ui = {
  toast: {
    durationMs: 5_000,
    limit: 3,
  },
  tooltip: {
    delayMs: 300,
    sideOffset: 6,
  },
  menu: {
    sideOffset: 6,
  },
} as const;

export type Ui = typeof ui;
