export const upload = {
  maxSizeBytes: 10 * 1024 * 1024,
  maxSizeLabel: '10 MB',
  allowedMimeTypes: [
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/webp',
    'application/pdf',
  ] as const,
} as const;

export type AllowedMimeType = (typeof upload.allowedMimeTypes)[number];

export const imageMimeTypes = upload.allowedMimeTypes.filter(
  (type): type is Exclude<AllowedMimeType, 'application/pdf'> => type !== 'application/pdf',
);

export const uploadAccept = upload.allowedMimeTypes.join(',');

export const imageAccept = imageMimeTypes.join(',');

export const pdfAccept = 'application/pdf';
