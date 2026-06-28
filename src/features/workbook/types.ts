import type { JSONContent } from '@tiptap/react';

/**
 * A workbook's content: a ProseMirror/Tiptap document (`{ type: 'doc', … }`).
 * This is exactly the JSON the API persists via `saveWorkbook` and returns from
 * the `workbook` query, so it can be passed straight through with no mapping.
 */
export type WorkbookDocument = JSONContent;

/** Imperative file-attachment handlers surfaced by `useWorkbookUploads`. */
export interface WorkbookUploadHandlers {
  /** Upload an image binary and insert it as an image node. */
  uploadImage: (file: File) => void;
  /** Upload a PDF binary and insert a link to it. */
  uploadPdf: (file: File) => void;
  /** True while a binary is in flight. */
  isUploading: boolean;
}
