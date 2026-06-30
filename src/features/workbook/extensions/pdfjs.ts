import type * as PdfjsModule from 'pdfjs-dist';

type Pdfjs = typeof PdfjsModule;

let pdfjsPromise: Promise<Pdfjs> | null = null;

/**
 * Lazily loads PDF.js on the client and points it at its bundled web worker.
 * Resolving the worker through `new URL(..., import.meta.url)` lets the bundler
 * (Turbopack in dev, Webpack at build) emit a version-matched worker asset, so
 * the API and worker can never drift out of sync.
 */
export function loadPdfjs(): Promise<Pdfjs> {
  pdfjsPromise ??= import('pdfjs-dist').then((pdfjs) => {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url,
    ).toString();
    return pdfjs;
  });

  return pdfjsPromise;
}
