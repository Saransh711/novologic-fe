'use client';

import { UploadCloud } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { labels, upload } from '@/config';
import { transitions } from '@/design/motion';

/**
 * Full-cover hint shown while files are dragged over the editor. Pointer events
 * are disabled so the drop still reaches the editable surface beneath it.
 */
export function DropOverlay() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-docked flex items-center justify-center rounded-lg border-2 border-dashed border-primary bg-bg/80 backdrop-blur-sm"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0 }}
      transition={transitions.fast}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface text-primary shadow-sm">
          <UploadCloud className="h-6 w-6" aria-hidden />
        </span>
        <p className="font-semibold text-foreground">{labels.editor.upload.dropTitle}</p>
        <p className="text-sm text-muted">{labels.editor.upload.dropHint(upload.maxSizeLabel)}</p>
      </div>
    </motion.div>
  );
}
