'use client';

import { useEffect, useRef } from 'react';
import { useEditor, type Editor, type JSONContent } from '@tiptap/react';
import { labels } from '@/config';
import { createWorkbookExtensions } from './editorExtensions';
import { EMPTY_DOCUMENT } from './emptyDocument';

export interface UseWorkbookEditorOptions {
  content?: JSONContent | null;
  editable?: boolean;
  onChange?: (doc: JSONContent) => void;
  onDropFiles?: (files: File[], pos: number | null) => void;
}

function filesFrom(list: FileList | null | undefined): File[] {
  return list && list.length > 0 ? Array.from(list) : [];
}

/**
 * Serializes a document with object keys sorted at every level. The backend
 * stores workbook content as Postgres `jsonb`, which does not preserve key
 * order, so a plain `JSON.stringify` comparison against `editor.getJSON()`
 * always differs even when nothing changed. That false mismatch would re-run
 * `setContent` on every autosave echo, rebuilding the document and tearing down
 * in-progress node views (e.g. a PDF mid-render). Comparing canonical forms
 * makes our own saved content compare equal while genuine external changes
 * (like a version restore) still differ.
 */
function canonicalJson(value: unknown): string {
  return JSON.stringify(value, (_key, val) => {
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      const record = val as Record<string, unknown>;
      return Object.keys(record)
        .sort()
        .reduce<Record<string, unknown>>((sorted, key) => {
          sorted[key] = record[key];
          return sorted;
        }, {});
    }
    return val;
  });
}

export function useWorkbookEditor({
  content,
  editable = true,
  onChange,
  onDropFiles,
}: UseWorkbookEditorOptions): Editor | null {
  const onChangeRef = useRef(onChange);
  const onDropFilesRef = useRef(onDropFiles);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onDropFilesRef.current = onDropFiles;
  }, [onDropFiles]);

  const editor = useEditor({
    immediatelyRender: false,
    editable,
    extensions: createWorkbookExtensions(),
    content: content ?? EMPTY_DOCUMENT,
    editorProps: {
      attributes: {
        role: 'textbox',
        'aria-multiline': 'true',
        'aria-label': labels.a11y.editorRegion,
        class: 'workbook-prose__surface',
      },
      handleDrop: (view, event, _slice, moved) => {
        if (moved) return false;
        const files = filesFrom(event.dataTransfer?.files);
        if (files.length === 0) return false;
        event.preventDefault();
        const coords = view.posAtCoords({ left: event.clientX, top: event.clientY });
        onDropFilesRef.current?.(files, coords?.pos ?? null);
        return true;
      },
      handlePaste: (_view, event) => {
        const files = filesFrom(event.clipboardData?.files);
        if (files.length === 0) return false;
        event.preventDefault();
        onDropFilesRef.current?.(files, null);
        return true;
      },
    },
    onUpdate: ({ editor }) => onChangeRef.current?.(editor.getJSON()),
  });

  useEffect(() => {
    editor?.setEditable(editable);
  }, [editor, editable]);

  useEffect(() => {
    if (!editor || content == null) return;
    if (canonicalJson(editor.getJSON()) === canonicalJson(content)) return;
    queueMicrotask(() => {
      if (editor.isDestroyed) return;
      editor.commands.setContent(content, { emitUpdate: false });
    });
  }, [editor, content]);

  return editor;
}
