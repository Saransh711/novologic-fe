'use client';

import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';
import type { ThemeName } from '@/design/tokens';
import { applyTheme, getActiveTheme, getThemeServerSnapshot, subscribeTheme } from '@/lib/theme';
import { Button } from './button';

/**
 * Toggles between light and dark themes. The active theme is read from an
 * external store, so it stays in sync with toggles, other tabs, and OS
 * preference changes. Before hydration the theme is unknown, so a neutral
 * placeholder is shown.
 */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, getActiveTheme, getThemeServerSnapshot);
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
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="h-9 w-9 px-0"
    >
      {theme === null ? (
        <span className="h-4 w-4" />
      ) : isDark ? (
        <Sun className="h-4 w-4" aria-hidden />
      ) : (
        <Moon className="h-4 w-4" aria-hidden />
      )}
    </Button>
  );
}
