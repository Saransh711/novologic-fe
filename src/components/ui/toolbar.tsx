'use client';

import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { Toolbar as RadixToolbar } from 'radix-ui';
import { labels } from '@/config';
import { cn } from '@/lib/utils/cn';
import { focusRing, interactiveVariant } from './styles';

export const Toolbar = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof RadixToolbar.Root>
>(function Toolbar({ className, 'aria-label': ariaLabel, ...props }, ref) {
  return (
    <RadixToolbar.Root
      ref={ref}
      aria-label={ariaLabel ?? labels.a11y.toolbar}
      className={cn(
        'flex w-full items-center gap-1 overflow-x-auto rounded-lg border border-border bg-surface p-1 shadow-sm',
        className,
      )}
      {...props}
    />
  );
});

export const ToolbarButton = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof RadixToolbar.Button>
>(function ToolbarButton({ className, ...props }, ref) {
  return (
    <RadixToolbar.Button
      ref={ref}
      className={cn(
        'inline-flex h-11 min-w-11 select-none items-center justify-center gap-2 rounded-md px-2.5 text-sm font-medium transition duration-base ease-standard sm:h-9 sm:min-w-9',
        'motion-safe:active:scale-95 disabled:pointer-events-none disabled:opacity-50',
        '[&_svg]:h-5 [&_svg]:w-5',
        interactiveVariant.ghost,
        focusRing,
        className,
      )}
      {...props}
    />
  );
});

export function ToolbarSeparator({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof RadixToolbar.Separator>) {
  return (
    <RadixToolbar.Separator
      className={cn('mx-1 h-6 w-px shrink-0 bg-border', className)}
      {...props}
    />
  );
}

export const ToolbarToggleGroup = RadixToolbar.ToggleGroup;

export const ToolbarToggleItem = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof RadixToolbar.ToggleItem>
>(function ToolbarToggleItem({ className, ...props }, ref) {
  return (
    <RadixToolbar.ToggleItem
      ref={ref}
      className={cn(
        'inline-flex h-11 min-w-11 select-none items-center justify-center gap-2 rounded-md px-2.5 text-sm font-medium text-muted transition duration-base ease-standard sm:h-9 sm:min-w-9',
        'hover:bg-surface-muted hover:text-foreground motion-safe:active:scale-95',
        'data-[state=on]:bg-surface-muted data-[state=on]:text-foreground',
        'disabled:pointer-events-none disabled:opacity-50 [&_svg]:h-5 [&_svg]:w-5',
        focusRing,
        className,
      )}
      {...props}
    />
  );
});
