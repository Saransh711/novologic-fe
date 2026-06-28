'use client';

import { FileText, ImageIcon } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { labels } from '@/config';
import { transitions } from '@/design/motion';
import type { ActiveUpload } from './types';

export interface UploadProgressProps {
  uploads: ActiveUpload[];
}

const FRACTION_TO_PERCENT = 100;

export function UploadProgress({ uploads }: UploadProgressProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={labels.a11y.uploadProgress}
      className="pointer-events-none absolute inset-x-3 bottom-3 z-docked ml-auto flex max-w-xs flex-col gap-2"
    >
      <AnimatePresence initial={false}>
        {uploads.map((item) => {
          const percent = Math.round(item.progress * FRACTION_TO_PERCENT);
          const Icon = item.kind === 'pdf' ? FileText : ImageIcon;

          return (
            <motion.div
              key={item.id}
              layout={!reduceMotion}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              transition={transitions.base}
              className="pointer-events-auto rounded-lg border border-border bg-surface p-3 shadow-md"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 shrink-0 text-muted" aria-hidden />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground" title={item.name}>
                  {item.name}
                </span>
                <span className="shrink-0 text-xs tabular-nums text-muted">{percent}%</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-base ease-standard"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="sr-only">{labels.editor.upload.uploadingFile(item.name)}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
