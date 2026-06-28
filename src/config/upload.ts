/**
 * Upload constraints. These mirror the API allowlist (images + PDF, 10 MiB) so
 * the client can reject invalid files before they ever reach the server.
 */
export const upload = {
  /** Maximum accepted file size in bytes (10 MiB). */
  maxSizeBytes: 10 * 1024 * 1024,
  /** Human-readable size limit for UI copy. */
  maxSizeLabel: '10 MB',
  /** Allowlisted IANA media types. */
  allowedMimeTypes: [
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/webp',
    'application/pdf',
  ] as const,
} as const;

export type AllowedMimeType = (typeof upload.allowedMimeTypes)[number];

/** The image subset of the allowlist (everything except PDF). */
export const imageMimeTypes = upload.allowedMimeTypes.filter(
  (type): type is Exclude<AllowedMimeType, 'application/pdf'> => type !== 'application/pdf',
);

/** Value for an `<input type="file" accept="…">` attribute. */
export const uploadAccept = upload.allowedMimeTypes.join(',');

/** `accept` value restricting a picker to allowlisted image types. */
export const imageAccept = imageMimeTypes.join(',');

/** `accept` value restricting a picker to PDF files. */
export const pdfAccept = 'application/pdf';
