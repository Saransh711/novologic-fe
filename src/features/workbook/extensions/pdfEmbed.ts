import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { PdfEmbedView } from './PdfEmbedView';

/** Schema name of the embedded-PDF node; shared with insertion call sites. */
export const PDF_EMBED_NAME = 'pdfEmbed' as const;

const DATA_ATTR = 'data-pdf-embed';

/**
 * A block-level, atomic node representing an uploaded PDF. It stores only the
 * served `src` URL and a display `title`; the binary lives behind the API's
 * static file route. Editing renders through {@link PdfEmbedView} (an iframe
 * preview); `renderHTML`/`parseHTML` keep copy-paste and HTML export lossless.
 */
export const PdfEmbed = Node.create({
  name: PDF_EMBED_NAME,
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-src'),
        renderHTML: (attributes) =>
          attributes.src ? { 'data-src': attributes.src as string } : {},
      },
      title: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-title'),
        renderHTML: (attributes) =>
          attributes.title ? { 'data-title': attributes.title as string } : {},
      },
    };
  },

  parseHTML() {
    return [{ tag: `div[${DATA_ATTR}]` }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { [DATA_ATTR]: '' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PdfEmbedView);
  },
});
