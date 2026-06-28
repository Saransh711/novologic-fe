import { type ElementType, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
}

export function Container({ as, className, ...props }: ContainerProps) {
  const Component = as ?? 'div';
  return (
    <Component
      className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8', className)}
      {...props}
    />
  );
}
