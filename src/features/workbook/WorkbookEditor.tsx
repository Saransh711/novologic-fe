'use client';

import { EditorContent, type JSONContent } from '@tiptap/react';
import { Skeleton } from '@/components/ui';
import { cn } from '@/lib/utils/cn';
import { useWorkbookEditor } from './useWorkbookEditor';
import { useWorkbookUploads } from './useWorkbookUploads';
import { WorkbookToolbar } from './WorkbookToolbar';

export interface WorkbookEditorProps {
  /** Initial ProseMirror document; omit/`null` to start empty. */
  content?: JSONContent | null;
  /** Read-only mode hides the toolbar and disables editing. */
  editable?: boolean;
  /** When set, uploaded attachments are recorded against this project. */
  projectId?: string;
  /** Receives the full document JSON on every change. */
  onChange?: (doc: JSONContent) => void;
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
  className,
}: WorkbookEditorProps) {
  const editor = useWorkbookEditor({ content, editable, onChange });
  const uploads = useWorkbookUploads(editor, projectId);

  return (
    <div className={cn('workbook-prose flex flex-col gap-3', className)}>
      {editable &&
        (editor ? (
          <WorkbookToolbar editor={editor} uploads={uploads} />
        ) : (
          <Skeleton className="h-12 w-full rounded-lg" />
        ))}

      <div
        className={cn(
          'rounded-lg border border-border bg-surface shadow-sm transition-shadow duration-base ease-standard',
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
      </div>
    </div>
  );
}
