/**
 * Behavioural constants for the shared UI primitives. Timing here is about
 * interaction behaviour (how long a toast lingers, how long before a tooltip
 * appears) — distinct from the motion *durations* in the design tokens, which
 * govern how individual transitions animate.
 */
export const ui = {
  toast: {
    /** How long a toast stays on screen before auto-dismissing. */
    durationMs: 5_000,
    /** Maximum number of toasts visible at once; older ones are evicted. */
    limit: 3,
  },
  tooltip: {
    /** Idle hover/focus delay before a tooltip opens. */
    delayMs: 300,
    /** Gap between the trigger and the tooltip surface. */
    sideOffset: 6,
  },
  menu: {
    /** Gap between the trigger and the menu surface. */
    sideOffset: 6,
  },
} as const;

export type Ui = typeof ui;
