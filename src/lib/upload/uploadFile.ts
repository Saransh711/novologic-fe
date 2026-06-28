/**
 * Binary file upload — step 1 of the API's two-step attachment flow. The binary
 * is sent over REST (`POST /files/upload`); the returned `storageKey` is then
 * recorded against a project with the `uploadFileMetadata` GraphQL mutation.
 *
 * Client-side guards mirror the server allowlist (`src/config/upload.ts`) so an
 * oversized or unsupported file is rejected before it ever leaves the browser.
 */
import { env, upload, type AllowedMimeType } from '@/config';

/** Shape of a successful `POST /files/upload` response (see the API contract). */
export interface UploadedFile {
  /** Server-generated key; submit this to `uploadFileMetadata`. */
  storageKey: string;
  /** Absolute URL the stored binary is served from. */
  url: string;
  /** Sanitised original filename (display only). */
  name: string;
  /** Detected MIME type of the stored file. */
  mimeType: string;
  /** Stored size in bytes. */
  size: number;
}

/** Machine-readable reasons an upload can fail, for branching UI copy. */
export type UploadErrorReason = 'too-large' | 'unsupported-type' | 'network' | 'server';

/** Error thrown by {@link uploadFile}; `reason` is stable, `message` is not. */
export class UploadError extends Error {
  readonly reason: UploadErrorReason;

  constructor(reason: UploadErrorReason, message: string) {
    super(message);
    this.name = 'UploadError';
    this.reason = reason;
  }
}

function isAllowedType(type: string): type is AllowedMimeType {
  return (upload.allowedMimeTypes as readonly string[]).includes(type);
}

/**
 * Mirrors the server allowlist so a file can be rejected before any network
 * round-trip. Returns the failing {@link UploadErrorReason}, or `null` when the
 * file is acceptable.
 */
export function validateUploadFile(file: File): Extract<UploadErrorReason, 'too-large' | 'unsupported-type'> | null {
  if (!isAllowedType(file.type)) return 'unsupported-type';
  if (file.size > upload.maxSizeBytes) return 'too-large';
  return null;
}

/** Optional hooks for an in-flight upload. */
export interface UploadOptions {
  /** Aborts the request when signalled. */
  signal?: AbortSignal;
  /** Receives upload progress as a fraction in `[0, 1]` (when computable). */
  onProgress?: (fraction: number) => void;
}

const UPLOAD_PATH = '/files/upload';
const FORM_FIELD = 'file';
const HTTP_OK_MIN = 200;
const HTTP_OK_MAX = 299;
const HTTP_PAYLOAD_TOO_LARGE = 413;

/**
 * Uploads a single file and resolves with its stored location. Validates type
 * and size locally first, then throws an {@link UploadError} on any server or
 * network failure so callers can map `reason` to user-facing copy. Uses
 * `XMLHttpRequest` rather than `fetch` so determinate progress events are
 * available for a progress UI.
 */
export function uploadFile(file: File, { signal, onProgress }: UploadOptions = {}): Promise<UploadedFile> {
  const invalid = validateUploadFile(file);
  if (invalid === 'unsupported-type') {
    return Promise.reject(new UploadError('unsupported-type', `Unsupported file type "${file.type}".`));
  }
  if (invalid === 'too-large') {
    return Promise.reject(
      new UploadError('too-large', `File size ${file.size} exceeds the limit of ${upload.maxSizeBytes} bytes.`),
    );
  }

  return new Promise<UploadedFile>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Upload aborted.', 'AbortError'));
      return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${env.apiBaseUrl}${UPLOAD_PATH}`);
    xhr.responseType = 'json';

    const onAbort = () => xhr.abort();
    signal?.addEventListener('abort', onAbort);
    const cleanup = () => signal?.removeEventListener('abort', onAbort);

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) onProgress?.(event.loaded / event.total);
    });

    xhr.addEventListener('load', () => {
      cleanup();
      if (xhr.status >= HTTP_OK_MIN && xhr.status <= HTTP_OK_MAX) {
        onProgress?.(1);
        resolve(xhr.response as UploadedFile);
        return;
      }
      const reason: UploadErrorReason = xhr.status === HTTP_PAYLOAD_TOO_LARGE ? 'too-large' : 'server';
      reject(new UploadError(reason, `Upload failed with status ${xhr.status}.`));
    });

    xhr.addEventListener('error', () => {
      cleanup();
      reject(new UploadError('network', 'Could not reach the upload service.'));
    });

    xhr.addEventListener('abort', () => {
      cleanup();
      reject(new DOMException('Upload aborted.', 'AbortError'));
    });

    const body = new FormData();
    body.append(FORM_FIELD, file);
    xhr.send(body);
  });
}
