
import { tokens } from '@/design/tokens';

export const BREAKPOINT_NAMES = ['sm', 'md', 'lg', 'xl', '2xl'] as const;

export type BreakpointName = (typeof BREAKPOINT_NAMES)[number];

export const breakpoints: Record<BreakpointName, string> = tokens.breakpoints;

export function minWidth(name: BreakpointName): string {
  return `(min-width: ${breakpoints[name]})`;
}
