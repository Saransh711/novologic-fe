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
  label?: string;
}

export function Spinner({ size = 'md', className, label = labels.states.loading }: SpinnerProps) {
  return (
    <span role="status" aria-live="polite" className={cn('inline-flex text-current', className)}>
      <Loader2 className={cn('animate-spin', sizeClasses[size])} aria-hidden />
      <span className="sr-only">{label}</span>
    </span>
  );
}
