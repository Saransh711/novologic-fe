'use client';

import { useSyncExternalStore } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { labels } from '@/config';
import { transitions } from '@/design/motion';
import type { ThemeName } from '@/design/tokens';
import { applyTheme, getActiveTheme, getThemeServerSnapshot, subscribeTheme } from '@/lib/theme';
import { Button } from './button';

/**
 * Toggles between light and dark themes. The active theme is read from an
 * external store, so it stays in sync with toggles, other tabs, and OS
 * preference changes. The icons cross-fade and counter-rotate on switch — a
 * sun rises as the moon sets — using the shared motion tokens; the swap is
 * instantaneous under `prefers-reduced-motion`. Before hydration the theme is
 * unknown, so a neutral placeholder holds the layout.
 */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, getActiveTheme, getThemeServerSnapshot);
  const reduceMotion = useReducedMotion();
  const isDark = theme === 'dark';

  function toggle() {
    const current = theme ?? getActiveTheme();
    const next: ThemeName = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      aria-label={isDark ? labels.a11y.switchToLight : labels.a11y.switchToDark}
      className="relative h-9 w-9 overflow-hidden px-0"
    >
      {theme === null ? (
        <span className="h-4 w-4" />
      ) : (
        <AnimatePresence initial={false} mode="sync">
          <motion.span
            key={theme}
            aria-hidden
            className="absolute inset-0 inline-flex items-center justify-center"
            initial={reduceMotion ? false : { opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, rotate: 90, scale: 0.5 }}
            transition={transitions.base}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </motion.span>
        </AnimatePresence>
      )}
    </Button>
  );
}
