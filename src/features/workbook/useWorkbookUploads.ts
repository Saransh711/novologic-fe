'use client';

import { useCallback, useState } from 'react';
import type { Editor } from '@tiptap/react';
import { labels, upload } from '@/config';
import { useToast } from '@/components/ui';
import { useUploadFileMetadataMutation } from '@/lib/graphql';
import { uploadFile, UploadError } from '@/lib/upload';
import type { WorkbookUploadHandlers } from './types';

type UploadKind = 'image' | 'pdf';

function describeError(error: unknown): string {
  if (error instanceof UploadError) {
    if (error.reason === 'too-large') return labels.editor.upload.tooLarge(upload.maxSizeLabel);
    if (error.reason === 'unsupported-type') return labels.editor.upload.unsupported;
  }
  return labels.editor.upload.generic;
}

/**
 * Wires the toolbar's "Upload image" / "Upload PDF" actions to the API flow:
 * the binary goes over REST (`/files/upload`); when a `projectId` is supplied
 * the returned `storageKey` is recorded via `uploadFileMetadata`; finally the
 * asset is inserted into the document — an image node for pictures, a link for
 * PDFs (which have no inline representation). Failures surface as a toast.
 */
export function useWorkbookUploads(
  editor: Editor | null,
  projectId?: string,
): WorkbookUploadHandlers {
  const { toast } = useToast();
  const [recordMetadata] = useUploadFileMetadataMutation();
  const [isUploading, setIsUploading] = useState(false);

  const handle = useCallback(
    async (file: File, kind: UploadKind) => {
      if (!editor) return;
      setIsUploading(true);
      try {
        const asset = await uploadFile(file);

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

        if (kind === 'image') {
          editor.chain().focus().setImage({ src: asset.url, alt: asset.name }).run();
        } else {
          editor
            .chain()
            .focus()
            .insertContent({
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: asset.name,
                  marks: [
                    {
                      type: 'link',
                      attrs: { href: asset.url, target: '_blank', rel: 'noopener noreferrer' },
                    },
                  ],
                },
              ],
            })
            .run();
        }

        toast({
          variant: 'success',
          title: labels.editor.upload.success,
          description: asset.name,
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        toast({
          variant: 'danger',
          title: labels.editor.upload.failedTitle,
          description: describeError(error),
        });
      } finally {
        setIsUploading(false);
      }
    },
    [editor, projectId, recordMetadata, toast],
  );

  const uploadImage = useCallback((file: File) => void handle(file, 'image'), [handle]);
  const uploadPdf = useCallback((file: File) => void handle(file, 'pdf'), [handle]);

  return { uploadImage, uploadPdf, isUploading };
}
