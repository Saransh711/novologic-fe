'use client';

import { ExternalLink, FileText } from 'lucide-react';
import { NodeViewWrapper, type ReactNodeViewProps } from '@tiptap/react';
import { labels } from '@/config';
import { cn } from '@/lib/utils/cn';

/**
 * Renders the `pdfEmbed` node: a framed, inline PDF preview with a header
 * showing the filename and a link to open the document in a new tab. The node
 * is an atom, so the whole card is non-editable; `data-drag-handle` lets the
 * user reposition it like any other block.
 */
export function PdfEmbedView({ node, selected }: ReactNodeViewProps) {
  const src = typeof node.attrs.src === 'string' ? node.attrs.src : '';
  const title =
    typeof node.attrs.title === 'string' && node.attrs.title.length > 0
      ? node.attrs.title
      : labels.editor.pdf.untitled;

  return (
    <NodeViewWrapper
      className={cn('workbook-pdf', selected && 'workbook-pdf--selected')}
      data-drag-handle
    >
      <div className="workbook-pdf__bar" contentEditable={false}>
        <FileText className="workbook-pdf__icon" aria-hidden />
        <span className="workbook-pdf__name" title={title}>
          {title}
        </span>
        {src && (
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="workbook-pdf__open"
            aria-label={labels.editor.pdf.openInNewTab}
          >
            <ExternalLink aria-hidden />
          </a>
        )}
      </div>
      {src && (
        <iframe
          src={src}
          title={labels.editor.pdf.previewLabel(title)}
          className="workbook-pdf__frame"
          loading="lazy"
        />
      )}
    </NodeViewWrapper>
  );
}
