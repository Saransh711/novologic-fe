'use client';

import { useCallback, useState } from 'react';
import type { Editor, JSONContent } from '@tiptap/react';
import { labels, upload } from '@/config';
import { useToast } from '@/components/ui';
import { useUploadFileMetadataMutation } from '@/lib/graphql';
import { uploadFile, validateUploadFile, UploadError, type UploadedFile } from '@/lib/upload';
import { PDF_EMBED_NAME } from './extensions/pdfEmbed';
import type { ActiveUpload, WorkbookUploadHandlers } from './types';

type UploadKind = ActiveUpload['kind'];

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

function kindOf(file: File): UploadKind {
  return file.type === 'application/pdf' ? 'pdf' : 'image';
}

function describeError(error: unknown): string {
  if (error instanceof UploadError) {
    if (error.reason === 'too-large') return labels.editor.upload.tooLarge(upload.maxSizeLabel);
    if (error.reason === 'unsupported-type') return labels.editor.upload.unsupported;
  }
  return labels.editor.upload.generic;
}

function assetNode(asset: UploadedFile, kind: UploadKind): JSONContent {
  if (kind === 'image') {
    return { type: 'image', attrs: { src: asset.url, alt: asset.name } };
  }
  return { type: PDF_EMBED_NAME, attrs: { src: asset.url, title: asset.name } };
}

function insertAsset(editor: Editor, node: JSONContent, pos: number | null) {
  if (editor.isDestroyed) return;
  const chain = editor.chain().focus();
  (pos == null ? chain.insertContent(node) : chain.insertContentAt(pos, node)).run();
}

export function useWorkbookUploads(
  editor: Editor | null,
  projectId?: string,
): WorkbookUploadHandlers {
  const { toast } = useToast();
  const [recordMetadata] = useUploadFileMetadataMutation();
  const [active, setActive] = useState<ActiveUpload[]>([]);

  const handleOne = useCallback(
    async (file: File, pos: number | null) => {
      if (!editor) return;

      const invalid = validateUploadFile(file);
      if (invalid) {
        toast({
          variant: 'danger',
          title: labels.editor.upload.failedTitle,
          description: describeError(new UploadError(invalid, '')),
        });
        return;
      }

      const id = crypto.randomUUID();
      const kind = kindOf(file);
      setActive((prev) => [...prev, { id, name: file.name, kind, progress: 0 }]);

      try {
        const asset = await uploadFile(file, {
          onProgress: (progress) =>
            setActive((prev) => prev.map((item) => (item.id === id ? { ...item, progress } : item))),
        });

        if (projectId) {
          await recordMetadata({
            variables: {
              input: {
                projectId,
                name: asset.name,
                mimeType: asset.mimeType,
                size: asset.size,
                storageKey: asset.storageKey,
              },
            },
          });
        }

        insertAsset(editor, assetNode(asset, kind), pos);

        toast({
          variant: 'success',
          title: labels.editor.upload.success,
          description: asset.name,
        });
      } catch (error) {
        if (isAbortError(error)) return;
        toast({
          variant: 'danger',
          title: labels.editor.upload.failedTitle,
          description: describeError(error),
        });
      } finally {
        setActive((prev) => prev.filter((item) => item.id !== id));
      }
    },
    [editor, projectId, recordMetadata, toast],
  );

  const uploadFilesAt = useCallback(
    (files: File[], pos: number | null) => {
      files.forEach((file) => void handleOne(file, pos));
    },
    [handleOne],
  );

  const uploadImage = useCallback((file: File) => void handleOne(file, null), [handleOne]);
  const uploadPdf = useCallback((file: File) => void handleOne(file, null), [handleOne]);

  return { uploadImage, uploadPdf, uploadFilesAt, active, isUploading: active.length > 0 };
}
