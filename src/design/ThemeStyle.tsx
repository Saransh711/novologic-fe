import { buildThemeCss } from './css-variables';

/**
 * Injects the token-derived CSS custom properties into the document head.
 * Rendered once in the root layout (server component, no client JS) so the
 * variables are present on first paint — no flash, no duplication.
 */
const themeCss = buildThemeCss();

export function ThemeStyle() {
  return <style id="design-tokens" dangerouslySetInnerHTML={{ __html: themeCss }} />;
}
