import { type ElementType, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  /** Render as a different element (e.g. `main`, `section`). Defaults to `div`. */
  as?: ElementType;
}

/**
 * Centres content and applies the shared responsive gutters. The single place
 * the app's max content width and horizontal padding are defined.
 */
export function Container({ as, className, ...props }: ContainerProps) {
  const Component = as ?? 'div';
  return (
    <Component
      className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8', className)}
      {...props}
    />
  );
}
