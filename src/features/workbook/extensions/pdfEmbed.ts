import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { PdfEmbedView } from './PdfEmbedView';

export const PDF_EMBED_NAME = 'pdfEmbed' as const;

const DATA_ATTR = 'data-pdf-embed';

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
