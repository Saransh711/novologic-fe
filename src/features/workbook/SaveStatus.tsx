'use client';

import { Check, Loader2, TriangleAlert } from 'lucide-react';
import { labels } from '@/config';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils/cn';
import type { SaveStatus as SaveStatusValue } from './useWorkbookAutosave';

export interface SaveStatusProps {
  status: SaveStatusValue;
  onRetry: () => void;
  className?: string;
}

/**
 * Compact autosave indicator for the app header. The whole control is a polite
 * live region so screen readers hear "Saving…" / "All changes saved" without
 * the label stealing focus; the text label is hidden on the narrowest screens
 * to keep the header uncluttered.
 */
export function SaveStatus({ status, onRetry, className }: SaveStatusProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={labels.a11y.saveStatus}
      className={cn('flex items-center gap-2 text-sm', className)}
    >
      {status === 'saving' && (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-muted" aria-hidden />
          <span className="hidden text-muted sm:inline">{labels.states.saving}</span>
        </>
      )}

      {status === 'saved' && (
        <>
          <Check className="h-4 w-4 text-success" aria-hidden />
          <span className="hidden text-muted sm:inline">{labels.states.saved}</span>
        </>
      )}

      {status === 'error' && (
        <>
          <TriangleAlert className="h-4 w-4 text-danger" aria-hidden />
          <span className="hidden text-danger sm:inline">{labels.states.saveError}</span>
          <Button variant="ghost" size="sm" onClick={onRetry}>
            {labels.actions.retry}
          </Button>
        </>
      )}
    </div>
  );
}
