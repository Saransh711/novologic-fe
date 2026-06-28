import { Loader2 } from 'lucide-react';
import { labels } from '@/config';
import { cn } from '@/lib/utils/cn';

export type SpinnerSize = 'sm' | 'md' | 'lg';

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-8 w-8',
};

export interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  /** Accessible label announced to assistive tech. Defaults to "Loading…". */
  label?: string;
}

/**
 * Indeterminate loading indicator. Inherits `currentColor`, so it adopts the
 * colour of whatever context it sits in. The spin is suppressed automatically
 * under `prefers-reduced-motion` via the global reduced-motion rule.
 */
export function Spinner({ size = 'md', className, label = labels.states.loading }: SpinnerProps) {
  return (
    <span role="status" aria-live="polite" className={cn('inline-flex text-current', className)}>
      <Loader2 className={cn('animate-spin', sizeClasses[size])} aria-hidden />
      <span className="sr-only">{label}</span>
    </span>
  );
}
