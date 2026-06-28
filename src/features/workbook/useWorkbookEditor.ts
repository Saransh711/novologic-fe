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
}: UseWorkbookEditorOptions): Editor | null {
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

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
