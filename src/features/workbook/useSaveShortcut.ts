'use client';

import { useEffect, useRef } from 'react';

export function useSaveShortcut(onSave: () => void, enabled = true): void {
  const onSaveRef = useRef(onSave);

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const isSaveChord = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's';
      if (!isSaveChord || event.altKey || event.shiftKey) return;
      event.preventDefault();
      onSaveRef.current();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);
}
