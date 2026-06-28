'use client';

import { type ReactNode } from 'react';
import { ToastProvider, TooltipProvider } from '@/components/ui';

export function UiProviders({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <ToastProvider>{children}</ToastProvider>
    </TooltipProvider>
  );
}
