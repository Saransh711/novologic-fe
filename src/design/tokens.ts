
export interface ColorScheme {
  bg: string;
  surface: string;
  surfaceMuted: string;
  foreground: string;
  muted: string;
  border: string;
  ring: string;
  primary: string;
  primaryForeground: string;
  accent: string;
  accentForeground: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  danger: string;
  dangerForeground: string;
  overlay: string;
}

const lightColors: ColorScheme = {
  bg: '#f6f7fb',
  surface: '#ffffff',
  surfaceMuted: '#f1f5f9',
  foreground: '#0f172a',
  muted: '#64748b',
  border: '#e2e8f0',
  ring: '#4f46e5',
  primary: '#4f46e5',
  primaryForeground: '#ffffff',
  accent: '#0ea5e9',
  accentForeground: '#ffffff',
  success: '#16a34a',
  successForeground: '#ffffff',
  warning: '#d97706',
  warningForeground: '#ffffff',
  danger: '#dc2626',
  dangerForeground: '#ffffff',
  overlay: 'rgb(15 23 42 / 0.45)',
};

const darkColors: ColorScheme = {
  bg: '#0b1120',
  surface: '#111827',
  surfaceMuted: '#1e293b',
  foreground: '#e2e8f0',
  muted: '#94a3b8',
  border: '#1f2a3b',
  ring: '#818cf8',
  primary: '#6366f1',
  primaryForeground: '#ffffff',
  accent: '#38bdf8',
  accentForeground: '#04263a',
  success: '#22c55e',
  successForeground: '#04210f',
  warning: '#f59e0b',
  warningForeground: '#271800',
  danger: '#ef4444',
  dangerForeground: '#2a0606',
  overlay: 'rgb(2 6 23 / 0.6)',
};

export const colorThemes = {
  light: lightColors,
  dark: darkColors,
} as const;

export type ThemeName = keyof typeof colorThemes;

const fontFamily = {
  sans: [
    'ui-sans-serif',
    'system-ui',
    '-apple-system',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
} as const;

const fontSize = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
  '6xl': '3.75rem',
} as const;

const fontWeight = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

const lineHeight = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
} as const;

const letterSpacing = {
  tight: '-0.02em',
  normal: '0em',
  wide: '0.02em',
  wider: '0.04em',
} as const;

const typography = {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
} as const;

const spacing = {
  '0': '0px',
  px: '1px',
  '0.5': '0.125rem',
  '1': '0.25rem',
  '1.5': '0.375rem',
  '2': '0.5rem',
  '2.5': '0.625rem',
  '3': '0.75rem',
  '3.5': '0.875rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '7': '1.75rem',
  '8': '2rem',
  '9': '2.25rem',
  '10': '2.5rem',
  '11': '2.75rem',
  '12': '3rem',
  '14': '3.5rem',
  '16': '4rem',
  '20': '5rem',
  '24': '6rem',
  '28': '7rem',
  '32': '8rem',
  '40': '10rem',
  '48': '12rem',
  '56': '14rem',
  '64': '16rem',
  '72': '18rem',
  '80': '20rem',
  '96': '24rem',
} as const;

const radii = {
  none: '0px',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  full: '9999px',
} as const;

const shadows = {
  none: 'none',
  sm: '0 1px 1px -0.5px rgb(15 23 42 / 0.05), 0 1px 3px -1px rgb(15 23 42 / 0.07)',
  md: '0 2px 4px -2px rgb(15 23 42 / 0.07), 0 6px 16px -4px rgb(15 23 42 / 0.10)',
  lg: '0 4px 8px -4px rgb(15 23 42 / 0.08), 0 16px 32px -8px rgb(15 23 42 / 0.16)',
  xl: '0 8px 16px -8px rgb(15 23 42 / 0.10), 0 32px 56px -16px rgb(15 23 42 / 0.22)',
} as const;

const zIndex = {
  base: 0,
  docked: 10,
  sticky: 1100,
  dropdown: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  toast: 1600,
  tooltip: 1700,
} as const;

const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

const motion = {
  duration: {
    instant: 0,
    fast: 120,
    base: 200,
    slow: 320,
    slower: 480,
  },
  easing: {
    standard: [0.4, 0, 0.2, 1],
    decelerate: [0, 0, 0.2, 1],
    accelerate: [0.4, 0, 1, 1],
    emphasized: [0.2, 0, 0, 1],
  },
} as const;

export const tokens = {
  color: colorThemes,
  typography,
  spacing,
  radii,
  shadows,
  zIndex,
  breakpoints,
  motion,
} as const;

export type Tokens = typeof tokens;
