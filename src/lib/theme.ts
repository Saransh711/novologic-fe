import type { ThemeName } from '@/design/tokens';

/** localStorage key holding the user's explicit theme choice. */
export const THEME_STORAGE_KEY = 'workbook-theme';

/** Same-tab notification that the theme changed (the `storage` event does not fire in the originating tab). */
const THEME_CHANGE_EVENT = 'workbook:theme-change';

/**
 * Runs before paint to apply a previously chosen theme, preventing a flash of
 * the wrong colours. When nothing is stored the document follows the OS
 * preference via the `prefers-color-scheme` rules in the token stylesheet.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

export function getStoredTheme(): ThemeName | null {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(THEME_STORAGE_KEY);
  return value === 'light' || value === 'dark' ? value : null;
}

/** Resolves the theme currently in effect, falling back to the OS preference. */
export function getActiveTheme(): ThemeName {
  const stored = getStoredTheme();
  if (stored) return stored;
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export function applyTheme(theme: ThemeName): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

/**
 * `useSyncExternalStore` adapter so components observe the active theme as an
 * external system — updating on toggles, cross-tab storage writes, and OS
 * preference changes — without a setState-in-effect. The server snapshot is
 * `null` (the OS theme is unknowable on the server); the client reads the real
 * value, and React swaps it in after hydration without a mismatch warning.
 */
export function subscribeTheme(onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  window.addEventListener('storage', onChange);
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  media.addEventListener('change', onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
    media.removeEventListener('change', onChange);
  };
}

export function getThemeServerSnapshot(): ThemeName | null {
  return null;
}
