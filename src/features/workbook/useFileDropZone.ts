'use client';

import { useCallback, useRef, useState, type DragEvent } from 'react';

/** Drag handlers to spread onto the editor wrapper, plus the dragging flag. */
export interface FileDropZone {
  isDragging: boolean;
  dropZoneProps: {
    onDragEnter: (event: DragEvent) => void;
    onDragOver: (event: DragEvent) => void;
    onDragLeave: (event: DragEvent) => void;
    onDrop: (event: DragEvent) => void;
  };
}

/** True when a drag payload carries files (rather than text/HTML). */
function carriesFiles(event: DragEvent): boolean {
  return Array.from(event.dataTransfer?.types ?? []).includes('Files');
}

/**
 * Tracks file drag-and-drop over a container so an overlay can be shown. A depth
 * counter avoids the flicker caused by `dragenter`/`dragleave` firing for child
 * elements. The drop itself is handled by ProseMirror's `handleDrop`; this hook
 * only resets state and catches drops that land outside the editable surface
 * (forwarding them to `onFiles` so nothing is silently lost).
 */
export function useFileDropZone(
  enabled: boolean,
  onFiles: (files: File[], pos: number | null) => void,
): FileDropZone {
  const [isDragging, setIsDragging] = useState(false);
  const depth = useRef(0);

  const onDragEnter = useCallback(
    (event: DragEvent) => {
      if (!enabled || !carriesFiles(event)) return;
      depth.current += 1;
      setIsDragging(true);
    },
    [enabled],
  );

  const onDragOver = useCallback(
    (event: DragEvent) => {
      if (!enabled || !carriesFiles(event)) return;
      event.preventDefault();
    },
    [enabled],
  );

  const onDragLeave = useCallback(
    (event: DragEvent) => {
      if (!enabled || !carriesFiles(event)) return;
      depth.current = Math.max(0, depth.current - 1);
      if (depth.current === 0) setIsDragging(false);
    },
    [enabled],
  );

  const onDrop = useCallback(
    (event: DragEvent) => {
      if (!enabled) return;
      depth.current = 0;
      setIsDragging(false);
      if (event.defaultPrevented) return;
      const files = Array.from(event.dataTransfer?.files ?? []);
      if (files.length === 0) return;
      event.preventDefault();
      onFiles(files, null);
    },
    [enabled, onFiles],
  );

  return { isDragging, dropZoneProps: { onDragEnter, onDragOver, onDragLeave, onDrop } };
}
