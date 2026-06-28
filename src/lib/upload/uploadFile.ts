
import { env, upload, type AllowedMimeType } from '@/config';

export interface UploadedFile {
  storageKey: string;
  url: string;
  name: string;
  mimeType: string;
  size: number;
}

export type UploadErrorReason = 'too-large' | 'unsupported-type' | 'network' | 'server';

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

export function validateUploadFile(file: File): Extract<UploadErrorReason, 'too-large' | 'unsupported-type'> | null {
  if (!isAllowedType(file.type)) return 'unsupported-type';
  if (file.size > upload.maxSizeBytes) return 'too-large';
  return null;
}

export interface UploadOptions {
  signal?: AbortSignal;
  onProgress?: (fraction: number) => void;
}

const UPLOAD_PATH = '/files/upload';
const FORM_FIELD = 'file';
const HTTP_OK_MIN = 200;
const HTTP_OK_MAX = 299;
const HTTP_PAYLOAD_TOO_LARGE = 413;

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
