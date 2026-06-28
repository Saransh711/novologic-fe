/**
 * Derives, from `tokens.ts`, the two artifacts that keep the design system in
 * lock-step:
 *
 *  1. `themeCss` — the CSS custom-property declarations injected on `:root`
 *     (light) with overrides for explicit dark mode and `prefers-color-scheme`.
 *  2. `tailwindTokenRefs` — maps of token key -> `var(--…)` that `tailwind.config.ts`
 *     spreads into its theme, so every utility resolves to a runtime variable.
 *
 * Both are generated from the same token objects and the same variable-naming
 * function, so the CSS variables and Tailwind theme can never drift apart.
 */
import { colorThemes, tokens, type ColorScheme } from './tokens';

/** `surfaceMuted` -> `surface-muted`, `2xl` -> `2xl`. */
function kebab(key: string): string {
  return key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/** Spacing keys contain dots (`0.5`) which are illegal in CSS var names. */
function safe(key: string): string {
  return key.replace(/\./g, '_');
}

type VarMap = Record<string, string>;

const identity = (key: string): string => key;

interface RefOptions {
  /** Transforms the token key into the Tailwind utility key. Defaults to identity. */
  key?: (key: string) => string;
  /** Transforms the token key into the CSS variable suffix. Defaults to kebab-case. */
  varName?: (key: string) => string;
}

/**
 * Builds a `<utility key> -> var(--prefix-<var name>)` map for Tailwind. The
 * utility key and the variable suffix can differ: colours kebab-case both (so
 * `surfaceMuted` -> `bg-surface-muted`), while spacing keeps the literal key
 * (`0.5`) but sanitises the variable name (`--space-0_5`).
 */
function refs<T extends object>(source: T, prefix: string, options: RefOptions = {}): VarMap {
  const toKey = options.key ?? identity;
  const toVar = options.varName ?? kebab;
  return Object.fromEntries(
    Object.keys(source).map((key) => [toKey(key), `var(--${prefix}-${toVar(key)})`]),
  );
}

const colorRefs = refs(colorThemes.light, 'color', { key: kebab, varName: kebab });
const spacingRefs = refs(tokens.spacing, 'space', { varName: safe });
const radiusRefs = refs(tokens.radii, 'radius');
const shadowRefs = refs(tokens.shadows, 'shadow');
const fontFamilyRefs = refs(tokens.typography.fontFamily, 'font');
const fontSizeRefs = refs(tokens.typography.fontSize, 'text');
const fontWeightRefs = refs(tokens.typography.fontWeight, 'font-weight');
const lineHeightRefs = refs(tokens.typography.lineHeight, 'leading');
const letterSpacingRefs = refs(tokens.typography.letterSpacing, 'tracking');
const zIndexRefs = refs(tokens.zIndex, 'z');
const durationRefs = refs(tokens.motion.duration, 'duration');
const easingRefs = refs(tokens.motion.easing, 'ease');

/** Reference maps Tailwind composes into its theme. */
export const tailwindTokenRefs = {
  colors: colorRefs,
  spacing: spacingRefs,
  borderRadius: radiusRefs,
  boxShadow: shadowRefs,
  fontFamily: fontFamilyRefs,
  fontSize: fontSizeRefs,
  fontWeight: fontWeightRefs,
  lineHeight: lineHeightRefs,
  letterSpacing: letterSpacingRefs,
  zIndex: zIndexRefs,
  transitionDuration: durationRefs,
  transitionTimingFunction: easingRefs,
} as const;

function declarations(lines: string[]): string {
  return lines.map((line) => `  ${line}`).join('\n');
}

function colorVars(scheme: ColorScheme): string[] {
  return Object.entries(scheme).map(([key, value]) => `--color-${kebab(key)}: ${value};`);
}

function staticVars(): string[] {
  const lines: string[] = [];

  for (const [key, value] of Object.entries(tokens.spacing)) {
    lines.push(`--space-${safe(key)}: ${value};`);
  }
  for (const [key, value] of Object.entries(tokens.radii)) {
    lines.push(`--radius-${kebab(key)}: ${value};`);
  }
  for (const [key, value] of Object.entries(tokens.shadows)) {
    lines.push(`--shadow-${kebab(key)}: ${value};`);
  }
  for (const [key, value] of Object.entries(tokens.typography.fontFamily)) {
    lines.push(`--font-${kebab(key)}: ${value.join(', ')};`);
  }
  for (const [key, value] of Object.entries(tokens.typography.fontSize)) {
    lines.push(`--text-${kebab(key)}: ${value};`);
  }
  for (const [key, value] of Object.entries(tokens.typography.fontWeight)) {
    lines.push(`--font-weight-${kebab(key)}: ${value};`);
  }
  for (const [key, value] of Object.entries(tokens.typography.lineHeight)) {
    lines.push(`--leading-${kebab(key)}: ${value};`);
  }
  for (const [key, value] of Object.entries(tokens.typography.letterSpacing)) {
    lines.push(`--tracking-${kebab(key)}: ${value};`);
  }
  for (const [key, value] of Object.entries(tokens.zIndex)) {
    lines.push(`--z-${kebab(key)}: ${value};`);
  }
  for (const [key, value] of Object.entries(tokens.motion.duration)) {
    lines.push(`--duration-${kebab(key)}: ${value}ms;`);
  }
  for (const [key, value] of Object.entries(tokens.motion.easing)) {
    lines.push(`--ease-${kebab(key)}: cubic-bezier(${value.join(', ')});`);
  }

  return lines;
}

/**
 * Full theme stylesheet. Light is the `:root` default; dark applies when the
 * document opts in via `data-theme="dark"` or when the OS prefers dark and no
 * explicit theme has been chosen.
 */
export function buildThemeCss(): string {
  const root = declarations([...colorVars(colorThemes.light), ...staticVars()]);
  const dark = declarations(colorVars(colorThemes.dark));

  return [
    `:root {\n${root}\n}`,
    `[data-theme='dark'] {\n${dark}\n}`,
    `@media (prefers-color-scheme: dark) {\n  :root:not([data-theme='light']) {\n${dark
      .split('\n')
      .map((line) => `  ${line}`)
      .join('\n')}\n  }\n}`,
  ].join('\n\n');
}
