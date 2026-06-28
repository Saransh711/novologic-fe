/**
 * Framer Motion presets derived from the motion tokens, so animations share the
 * same durations and easings as CSS transitions. Components import these instead
 * of writing inline timing values.
 */
import type { Transition, Variants } from 'motion/react';
import { tokens } from './tokens';

const seconds = (ms: number): number => ms / 1000;

const ease = {
  standard: [...tokens.motion.easing.standard],
  emphasized: [...tokens.motion.easing.emphasized],
} as const;

export const transitions = {
  fast: { duration: seconds(tokens.motion.duration.fast), ease: ease.standard },
  base: { duration: seconds(tokens.motion.duration.base), ease: ease.standard },
  emphasized: { duration: seconds(tokens.motion.duration.slow), ease: ease.emphasized },
} satisfies Record<string, Transition>;

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: transitions.base },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: seconds(tokens.motion.duration.fast) } },
};
