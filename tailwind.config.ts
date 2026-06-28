import type { Config } from 'tailwindcss';
import { tokens } from './src/design/tokens';
import { tailwindTokenRefs } from './src/design/css-variables';

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
