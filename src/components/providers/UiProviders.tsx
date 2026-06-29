'use client';

import { type ReactNode } from 'react';
import { ToastProvider, TooltipProvider } from '@/components/ui';
import { AuthProvider } from '@/features/auth';

export function UiProviders({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <ToastProvider>
        <AuthProvider>{children}</AuthProvider>
      </ToastProvider>
    </TooltipProvider>
  );
}
