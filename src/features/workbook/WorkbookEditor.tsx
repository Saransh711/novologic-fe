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
  /** Initial ProseMirror document; omit/`null` to start empty. */
  content?: JSONContent | null;
  /** Read-only mode hides the toolbar and disables editing. */
  editable?: boolean;
  /** When set, uploaded attachments are recorded against this project. */
  projectId?: string;
  /** Receives the full document JSON on every change. */
  onChange?: (doc: JSONContent) => void;
  /**
   * Surfaces the editor instance (and `null` on teardown) so the parent can
   * drive it imperatively — e.g. appending an AI summary. Kept out of SSR by
   * living in this client-only, dynamically imported module.
   */
  onEditorReady?: (editor: Editor | null) => void;
  className?: string;
}

/**
 * The complete workbook editing surface: a responsive formatting toolbar above
 * a token-styled prose area. The document is the ProseMirror JSON the API
 * stores verbatim. Renders skeletons until the editor instance is ready (it is
 * created client-side only) so server and client markup match.
 */
export function WorkbookEditor({
  content,
  editable = true,
  projectId,
  onChange,
  onEditorReady,
  className,
}: WorkbookEditorProps) {
  // The drop handler needs the editor, but the editor needs a drop handler at
  // creation — break the cycle with a ref that always points at the latest one.
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
