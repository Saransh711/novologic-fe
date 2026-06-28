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

/** Value for an `<input type="file" accept="…">` attribute. */
export const uploadAccept = upload.allowedMimeTypes.join(',');

export type AllowedMimeType = (typeof upload.allowedMimeTypes)[number];
