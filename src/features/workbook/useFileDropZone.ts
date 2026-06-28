'use client';

import { useCallback, useRef, useState, type DragEvent } from 'react';

export interface FileDropZone {
  isDragging: boolean;
  dropZoneProps: {
    onDragEnter: (event: DragEvent) => void;
    onDragOver: (event: DragEvent) => void;
    onDragLeave: (event: DragEvent) => void;
    onDrop: (event: DragEvent) => void;
  };
}

function carriesFiles(event: DragEvent): boolean {
  return Array.from(event.dataTransfer?.types ?? []).includes('Files');
}

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
