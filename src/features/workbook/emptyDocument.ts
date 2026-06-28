import type { JSONContent } from '@tiptap/react';

/**
 * The canonical empty workbook: a ProseMirror `doc` with a single empty
 * paragraph. Matches the backend contract's starting document so a brand-new
 * workbook and a freshly cleared one serialise identically.
 */
export const EMPTY_DOCUMENT: JSONContent = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
};
