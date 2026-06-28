'use client';

import { type ReactNode } from 'react';
import { Tooltip as RadixTooltip } from 'radix-ui';
import { ui } from '@/config';
import { cn } from '@/lib/utils/cn';

export function TooltipProvider({ children }: { children: ReactNode }) {
  return (
    <RadixTooltip.Provider delayDuration={ui.tooltip.delayMs} skipDelayDuration={ui.tooltip.delayMs}>
      {children}
    </RadixTooltip.Provider>
  );
}

export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: TooltipSide;
  disabled?: boolean;
}

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
