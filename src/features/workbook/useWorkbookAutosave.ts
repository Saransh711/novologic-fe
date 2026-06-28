'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { JSONContent } from '@tiptap/react';
import { editor as editorConfig } from '@/config';
import { useSaveWorkbookMutation } from '@/lib/graphql';

/** Lifecycle of the current document relative to the server. */
export type SaveStatus = 'saved' | 'saving' | 'error';

export interface UseWorkbookAutosaveResult {
  status: SaveStatus;
  /** Feed every editor change here; saves are debounced automatically. */
  onChange: (doc: JSONContent) => void;
  /** Force an immediate save of the latest document (wired to error retry). */
  retry: () => void;
  /**
   * Immediately persist the latest document, flushing any pending debounce.
   * Unlike {@link retry}, it saves even when nothing is dirty so an explicit
   * save gesture (e.g. Ctrl+S) always gives feedback. No-op before the first edit.
   */
  saveNow: () => void;
}

/**
 * Debounced autosave for a project's workbook. A save fires once typing has
 * been idle for `autosaveDebounceMs`, and a `autosaveMaxWaitMs` ceiling
 * guarantees a save even during continuous typing. The latest document is kept
 * in a ref so the in-flight request always persists the freshest content, and a
 * best-effort flush on unmount avoids losing edits when navigating away.
 */
export function useWorkbookAutosave(projectId: string): UseWorkbookAutosaveResult {
  const [saveWorkbook] = useSaveWorkbookMutation();
  const [status, setStatus] = useState<SaveStatus>('saved');

  const latestDocRef = useRef<JSONContent | null>(null);
  const dirtyRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxWaitRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (maxWaitRef.current) clearTimeout(maxWaitRef.current);
    debounceRef.current = null;
    maxWaitRef.current = null;
  }, []);

  const save = useCallback(async (force = false) => {
    clearTimers();
    const doc = latestDocRef.current;
    if (!doc || (!dirtyRef.current && !force)) return;

    dirtyRef.current = false;
    setStatus('saving');
    try {
      await saveWorkbook({
        variables: { input: { projectId, content: doc as Record<string, unknown> } },
      });
      // A newer edit may have arrived mid-flight; keep showing "saving" if so.
      setStatus(dirtyRef.current ? 'saving' : 'saved');
    } catch {
      dirtyRef.current = true;
      setStatus('error');
    }
  }, [clearTimers, projectId, saveWorkbook]);

  const onChange = useCallback(
    (doc: JSONContent) => {
      latestDocRef.current = doc;
      dirtyRef.current = true;
      setStatus('saving');

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => void save(), editorConfig.autosaveDebounceMs);
      if (!maxWaitRef.current) {
        maxWaitRef.current = setTimeout(() => void save(), editorConfig.autosaveMaxWaitMs);
      }
    },
    [save],
  );

  const retry = useCallback(() => void save(), [save]);

  const saveNow = useCallback(() => void save(true), [save]);

  useEffect(() => {
    return () => {
      clearTimers();
      if (dirtyRef.current && latestDocRef.current) {
        void saveWorkbook({
          variables: {
            input: { projectId, content: latestDocRef.current as Record<string, unknown> },
          },
        }).catch(() => {});
      }
    };
  }, [clearTimers, projectId, saveWorkbook]);

  return { status, onChange, retry, saveNow };
}
