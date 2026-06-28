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
    queueMicrotask(() => {
      if (editor.isDestroyed) return;
      editor.commands.setContent(content, { emitUpdate: false });
    });
  }, [editor, content]);

  return editor;
}
