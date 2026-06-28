'use client';

import { useEffect, useRef } from 'react';

/**
 * Intercepts the platform save chord (Ctrl+S / ⌘S) anywhere on the page and runs
 * `onSave` instead of opening the browser's "Save page" dialog. Bold (Ctrl/⌘+B)
 * and italic (Ctrl/⌘+I) are handled natively by the editor's keymap, so only the
 * save gesture needs wiring here. The callback is read through a ref so a
 * changing identity never re-binds the listener.
 */
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
