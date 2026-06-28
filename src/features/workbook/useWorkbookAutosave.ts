'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { JSONContent } from '@tiptap/react';
import { editor as editorConfig } from '@/config';
import { useSaveWorkbookMutation } from '@/lib/graphql';

export type SaveStatus = 'saved' | 'saving' | 'error';

export interface UseWorkbookAutosaveResult {
  status: SaveStatus;
  onChange: (doc: JSONContent) => void;
  retry: () => void;
  saveNow: () => void;
}

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
