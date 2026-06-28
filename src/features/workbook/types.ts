import type { JSONContent } from '@tiptap/react';

/**
 * A workbook's content: a ProseMirror/Tiptap document (`{ type: 'doc', … }`).
 * This is exactly the JSON the API persists via `saveWorkbook` and returns from
 * the `workbook` query, so it can be passed straight through with no mapping.
 */
export type WorkbookDocument = JSONContent;

/** A single attachment currently being uploaded, for progress UI. */
export interface ActiveUpload {
  /** Stable client-generated id for list reconciliation. */
  id: string;
  /** Original filename, shown while the upload is in flight. */
  name: string;
  /** Which kind of node the asset will become once uploaded. */
  kind: 'image' | 'pdf';
  /** Upload progress as a fraction in `[0, 1]`. */
  progress: number;
}

/** Imperative file-attachment handlers surfaced by `useWorkbookUploads`. */
export interface WorkbookUploadHandlers {
  /** Upload an image binary and insert it as an image node at the cursor. */
  uploadImage: (file: File) => void;
  /** Upload a PDF binary and insert an embedded preview node at the cursor. */
  uploadPdf: (file: File) => void;
  /**
   * Upload one or more files, inserting each at `pos` (document position) or at
   * the current selection when `pos` is `null`. Used by drag-and-drop / paste.
   */
  uploadFilesAt: (files: File[], pos: number | null) => void;
  /** Uploads currently in flight, in insertion order. */
  active: ActiveUpload[];
  /** True while at least one binary is in flight. */
  isUploading: boolean;
}
