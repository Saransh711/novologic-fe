'use client';

import { type ReactNode } from 'react';
import { Tooltip as RadixTooltip } from 'radix-ui';
import { ui } from '@/config';
import { cn } from '@/lib/utils/cn';

/**
 * App-wide tooltip context. Mount once near the root so every tooltip shares
 * one hover-intent timer (moving between adjacent triggers feels instant).
 */
export function TooltipProvider({ children }: { children: ReactNode }) {
  return (
    <RadixTooltip.Provider delayDuration={ui.tooltip.delayMs} skipDelayDuration={ui.tooltip.delayMs}>
      {children}
    </RadixTooltip.Provider>
  );
}

export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';

export interface TooltipProps {
  /** The short, descriptive label shown on hover/focus. */
  content: ReactNode;
  children: ReactNode;
  side?: TooltipSide;
  /** Disable to render the trigger without a tooltip (e.g. when redundant). */
  disabled?: boolean;
}

/**
 * Wraps a single focusable child with an accessible tooltip. The child must
 * forward its ref and props, so pass a primitive like `IconButton`.
 */
export function Tooltip({ content, children, side = 'top', disabled = false }: TooltipProps) {
  if (disabled) return <>{children}</>;

  return (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          sideOffset={ui.tooltip.sideOffset}
          className={cn(
            'anim-tooltip z-tooltip max-w-xs rounded-md bg-foreground px-2 py-1 text-xs font-medium text-bg shadow-md',
            'origin-[var(--radix-tooltip-content-transform-origin)] select-none',
          )}
        >
          {content}
          <RadixTooltip.Arrow className="fill-foreground" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}
