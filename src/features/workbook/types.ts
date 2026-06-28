import type { JSONContent } from '@tiptap/react';

export type WorkbookDocument = JSONContent;

export interface ActiveUpload {
  id: string;
  name: string;
  kind: 'image' | 'pdf';
  progress: number;
}

export interface WorkbookUploadHandlers {
  uploadImage: (file: File) => void;
  uploadPdf: (file: File) => void;
  uploadFilesAt: (files: File[], pos: number | null) => void;
  active: ActiveUpload[];
  isUploading: boolean;
}
