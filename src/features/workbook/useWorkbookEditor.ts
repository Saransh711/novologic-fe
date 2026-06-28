'use client';

import { useEffect, useRef } from 'react';
import { useEditor, type Editor, type JSONContent } from '@tiptap/react';
import { labels } from '@/config';
import { createWorkbookExtensions } from './editorExtensions';
import { EMPTY_DOCUMENT } from './emptyDocument';

export interface UseWorkbookEditorOptions {
  /** Initial document; `null`/`undefined` starts from an empty doc. */
  content?: JSONContent | null;
  /** Whether the document is editable (false renders a read-only view). */
  editable?: boolean;
  /** Called with the full ProseMirror JSON on every change. */
  onChange?: (doc: JSONContent) => void;
  /**
   * Called when files are dropped or pasted into the editor. `pos` is the
   * document position to insert at, or `null` to use the current selection.
   */
  onDropFiles?: (files: File[], pos: number | null) => void;
}

/** Files from a drag/clipboard payload, or an empty array when there are none. */
function filesFrom(list: FileList | null | undefined): File[] {
  return list && list.length > 0 ? Array.from(list) : [];
}

/**
 * Creates the workbook Tiptap editor. `immediatelyRender: false` is required
 * under the App Router so server and client render the same initial markup.
 *
 * The editor is created once; `onChange` is read through a ref so a changing
 * callback identity never tears down the instance, and externally supplied
 * `content` (e.g. an async workbook load) is synced in without emitting an
 * update or clobbering in-progress edits.
 */
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
    if (JSON.stringify(editor.getJSON()) === JSON.stringify(content)) return;
    editor.commands.setContent(content, { emitUpdate: false });
  }, [editor, content]);

  return editor;
}
