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

const UPLOAD_PATH = '/files/upload';
const FORM_FIELD = 'file';

/**
 * Uploads a single file and resolves with its stored location. Validates type
 * and size locally first, then throws an {@link UploadError} on any server or
 * network failure so callers can map `reason` to user-facing copy.
 */
export async function uploadFile(file: File, signal?: AbortSignal): Promise<UploadedFile> {
  if (!isAllowedType(file.type)) {
    throw new UploadError('unsupported-type', `Unsupported file type "${file.type}".`);
  }
  if (file.size > upload.maxSizeBytes) {
    throw new UploadError(
      'too-large',
      `File size ${file.size} exceeds the limit of ${upload.maxSizeBytes} bytes.`,
    );
  }

  const body = new FormData();
  body.append(FORM_FIELD, file);

  let response: Response;
  try {
    response = await fetch(`${env.apiBaseUrl}${UPLOAD_PATH}`, { method: 'POST', body, signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new UploadError('network', 'Could not reach the upload service.');
  }

  if (!response.ok) {
    const reason: UploadErrorReason = response.status === 413 ? 'too-large' : 'server';
    throw new UploadError(reason, `Upload failed with status ${response.status}.`);
  }

  return (await response.json()) as UploadedFile;
}
