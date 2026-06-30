'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ExternalLink, FileText } from 'lucide-react';
import { NodeViewWrapper, type ReactNodeViewProps } from '@tiptap/react';
import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
import { labels } from '@/config';
import { cn } from '@/lib/utils/cn';
import { loadPdfjs } from './pdfjs';

type Status = 'loading' | 'ready' | 'error';

/** Cap the backing-store resolution so large multi-page PDFs stay affordable. */
const MAX_PIXEL_RATIO = 2;
const RESIZE_DEBOUNCE_MS = 200;
/** Ignore sub-pixel jitter from the ResizeObserver to avoid render churn. */
const WIDTH_CHANGE_THRESHOLD = 4;

function isRenderCancelled(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as { name?: string }).name === 'RenderingCancelledException'
  );
}

interface PdfPageCanvasProps {
  doc: PDFDocumentProxy;
  pageNum: number;
  totalPages: number;
  width: number;
}

function PdfPageCanvas({ doc, pageNum, totalPages, width }: PdfPageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context || !(width > 0)) return;

    let cancelled = false;
    let renderTask: RenderTask | null = null;

    void (async () => {
      try {
        const page = await doc.getPage(pageNum);
        if (cancelled) return;

        const unscaled = page.getViewport({ scale: 1 });
        const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
        const viewport = page.getViewport({ scale: (width / unscaled.width) * pixelRatio });

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${Math.floor(viewport.height) / pixelRatio}px`;

        renderTask = page.render({ canvas, viewport });
        await renderTask.promise;
      } catch (error) {
        if (!isRenderCancelled(error)) {
          // A single page failing shouldn't tear down the whole preview.
        }
      }
    })();

    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [doc, pageNum, width]);

  return (
    <canvas
      ref={canvasRef}
      className="workbook-pdf__page"
      role="img"
      aria-label={labels.editor.pdf.pageLabel(pageNum, totalPages)}
    />
  );
}

export function PdfEmbedView({ node, selected }: ReactNodeViewProps) {
  const src = typeof node.attrs.src === 'string' ? node.attrs.src : '';
  const title =
    typeof node.attrs.title === 'string' && node.attrs.title.length > 0
      ? node.attrs.title
      : labels.editor.pdf.untitled;

  const pagesRef = useRef<HTMLDivElement>(null);
  const loadingTaskRef = useRef<PDFDocumentLoadingTask | null>(null);

  // Tag results with the src they belong to so a src change drops stale state
  // in render, avoiding synchronous resets inside the load effect.
  const [loaded, setLoaded] = useState<{ src: string; doc: PDFDocumentProxy } | null>(null);
  const [errorSrc, setErrorSrc] = useState<string | null>(null);
  const [renderWidth, setRenderWidth] = useState(0);

  const doc = loaded && loaded.src === src ? loaded.doc : null;
  const effectiveStatus: Status =
    !src || errorSrc === src ? 'error' : doc ? 'ready' : 'loading';

  // Track the content-box width of the page stack so canvases render crisply
  // at the current layout size and re-render when it changes meaningfully.
  useLayoutEffect(() => {
    const el = pagesRef.current;
    if (!el) return;

    const contentWidth = () => {
      const styles = getComputedStyle(el);
      // parseFloat can yield NaN before the element is laid out; coerce to 0 so
      // a bad early measurement never poisons renderWidth.
      const padding = (parseFloat(styles.paddingLeft) || 0) + (parseFloat(styles.paddingRight) || 0);
      return Math.max(el.clientWidth - padding, 0);
    };

    setRenderWidth(contentWidth());

    let timer = 0;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? contentWidth();
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        // Always adopt the observed width if the previous value isn't a usable
        // number (e.g. an initial 0 measured before layout), otherwise debounce
        // to meaningful changes only.
        setRenderWidth((prev) =>
          !(prev > 0) || Math.abs(prev - width) > WIDTH_CHANGE_THRESHOLD ? width : prev,
        );
      }, RESIZE_DEBOUNCE_MS);
    });
    observer.observe(el);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  // Load the PDF document for the current src.
  useEffect(() => {
    if (!src) return;

    let cancelled = false;

    void (async () => {
      try {
        const pdfjs = await loadPdfjs();
        if (cancelled) return;
        const loadingTask = pdfjs.getDocument({ url: src });
        loadingTaskRef.current = loadingTask;
        const document = await loadingTask.promise;
        if (cancelled) return;
        setLoaded({ src, doc: document });
      } catch {
        if (!cancelled) setErrorSrc(src);
      }
    })();

    return () => {
      cancelled = true;
      // Destroying the loading task tears down the document and its worker
      // transport, covering both the resolved and still-loading cases.
      void loadingTaskRef.current?.destroy();
      loadingTaskRef.current = null;
    };
  }, [src]);

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
      <div
        ref={pagesRef}
        className="workbook-pdf__pages"
        contentEditable={false}
        role="group"
        aria-label={labels.editor.pdf.previewLabel(title)}
      >
        {effectiveStatus === 'loading' && (
          <p className="workbook-pdf__status">{labels.editor.pdf.loading}</p>
        )}
        {effectiveStatus === 'error' && (
          <p className="workbook-pdf__status">{labels.editor.pdf.loadError}</p>
        )}
        {effectiveStatus === 'ready' &&
          doc &&
          Array.from({ length: doc.numPages }, (_, index) => index + 1).map((pageNum) => (
            <PdfPageCanvas
              key={pageNum}
              doc={doc}
              pageNum={pageNum}
              totalPages={doc.numPages}
              width={renderWidth}
            />
          ))}
      </div>
    </NodeViewWrapper>
  );
}
