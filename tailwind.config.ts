import type { Config } from 'tailwindcss';
import { tokens } from './src/design/tokens';
import { tailwindTokenRefs } from './src/design/css-variables';

/**
 * The entire Tailwind theme is derived from the design tokens. Every utility
 * resolves to a CSS custom property (`var(--…)`) defined in `tokens.ts` and
 * injected at runtime, so there are no raw colour/size/shadow values here.
 * Breakpoints are the one build-time value (media queries cannot use variables)
 * and are read straight from the tokens.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    screens: { ...tokens.breakpoints },
    extend: {
      colors: tailwindTokenRefs.colors,
      spacing: tailwindTokenRefs.spacing,
      borderRadius: tailwindTokenRefs.borderRadius,
      boxShadow: tailwindTokenRefs.boxShadow,
      fontFamily: tailwindTokenRefs.fontFamily,
      fontSize: tailwindTokenRefs.fontSize,
      fontWeight: tailwindTokenRefs.fontWeight,
      lineHeight: tailwindTokenRefs.lineHeight,
      letterSpacing: tailwindTokenRefs.letterSpacing,
      zIndex: tailwindTokenRefs.zIndex,
      transitionDuration: tailwindTokenRefs.transitionDuration,
      transitionTimingFunction: tailwindTokenRefs.transitionTimingFunction,
    },
  },
};

export default config;
