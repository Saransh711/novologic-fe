/**
 * Responsive breakpoint names and their pixel widths. The values come from the
 * design tokens (single source of truth); this module names them for use in
 * matchMedia hooks and conditional layout logic.
 */
import { tokens } from '@/design/tokens';

export const BREAKPOINT_NAMES = ['sm', 'md', 'lg', 'xl', '2xl'] as const;

export type BreakpointName = (typeof BREAKPOINT_NAMES)[number];

export const breakpoints: Record<BreakpointName, string> = tokens.breakpoints;

/** Builds a `min-width` media query string for the given breakpoint. */
export function minWidth(name: BreakpointName): string {
  return `(min-width: ${breakpoints[name]})`;
}
