import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

/** Placeholder block for loading states. Compose several to mirror real layout. */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn('animate-pulse rounded-md bg-surface-muted', className)}
      {...props}
    />
  );
}
