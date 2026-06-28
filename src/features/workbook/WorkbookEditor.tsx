'use client';

import { useCallback, useEffect, useRef } from 'react';
import { EditorContent, type Editor, type JSONContent } from '@tiptap/react';
import { AnimatePresence } from 'motion/react';
import { labels } from '@/config';
import { Skeleton } from '@/components/ui';
import { cn } from '@/lib/utils/cn';
import { useWorkbookEditor } from './useWorkbookEditor';
import { useWorkbookUploads } from './useWorkbookUploads';
import { useFileDropZone } from './useFileDropZone';
import { WorkbookToolbar } from './WorkbookToolbar';
import { UploadProgress } from './UploadProgress';
import { DropOverlay } from './DropOverlay';

export interface WorkbookEditorProps {
  content?: JSONContent | null;
  editable?: boolean;
  projectId?: string;
  onChange?: (doc: JSONContent) => void;
  onEditorReady?: (editor: Editor | null) => void;
  className?: string;
}

export function WorkbookEditor({
  content,
  editable = true,
  projectId,
  onChange,
  onEditorReady,
  className,
}: WorkbookEditorProps) {
  const dropFilesRef = useRef<(files: File[], pos: number | null) => void>(() => {});
  const onDropFiles = useCallback((files: File[], pos: number | null) => {
    dropFilesRef.current(files, pos);
  }, []);

  const editor = useWorkbookEditor({ content, editable, onChange, onDropFiles });
  const uploads = useWorkbookUploads(editor, projectId);

  useEffect(() => {
    dropFilesRef.current = uploads.uploadFilesAt;
  }, [uploads.uploadFilesAt]);

  useEffect(() => {
    onEditorReady?.(editor);
    return () => onEditorReady?.(null);
  }, [editor, onEditorReady]);

  const { isDragging, dropZoneProps } = useFileDropZone(editable, uploads.uploadFilesAt);

  return (
    <div className={cn('workbook-prose flex flex-col gap-3', className)}>
      {editable &&
        (editor ? (
          <WorkbookToolbar editor={editor} uploads={uploads} />
        ) : (
          <Skeleton className="h-12 w-full rounded-lg" />
        ))}

      <div
        {...(editable ? dropZoneProps : {})}
        aria-label={editable ? labels.a11y.dropZone : undefined}
        className={cn(
          'relative rounded-lg border border-border bg-surface shadow-sm transition-shadow duration-base ease-standard',
          'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-bg',
        )}
      >
        {editor ? (
          <EditorContent editor={editor} />
        ) : (
          <div className="space-y-3 p-4">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        )}

        <AnimatePresence>{editable && isDragging && <DropOverlay />}</AnimatePresence>
        <UploadProgress uploads={uploads.active} />
      </div>
    </div>
  );
}
