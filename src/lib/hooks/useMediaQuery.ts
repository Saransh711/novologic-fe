'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { minWidth, type BreakpointName } from '@/config';

/**
 * Subscribes to a CSS media query and returns whether it currently matches.
 *
 * Implemented with `useSyncExternalStore` (mirroring `lib/theme.ts`) so it is
 * SSR-safe and tear-free: the server snapshot is `false` — a mobile-first
 * default that assumes the smaller layout until the client knows better — and
 * the client subscribes to live `change` events.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window === 'undefined') return () => {};
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  }, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/**
 * `true` once the viewport is at least the given breakpoint wide. The width
 * comes from the design tokens via `minWidth`, so breakpoints stay the single
 * source of truth shared with Tailwind.
 */
export function useBreakpoint(name: BreakpointName): boolean {
  return useMediaQuery(minWidth(name));
}
