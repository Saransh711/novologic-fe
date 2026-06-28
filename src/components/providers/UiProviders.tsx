'use client';

import { type ReactNode } from 'react';
import { ToastProvider, TooltipProvider } from '@/components/ui';

/**
 * Bundles the client-side UI context providers (tooltip hover-intent + toast
 * queue) so the root layout can stay a Server Component and only cross the
 * client boundary once.
 */
export function UiProviders({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <ToastProvider>{children}</ToastProvider>
    </TooltipProvider>
  );
}
