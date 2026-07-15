import { basename, extname } from 'node:path';

import { StorageError } from '../application/errors/storage-error';

export const maxFileSizeBytes = 2 * 1024 * 1024;

export const allowedMimeTypes = new Map<string, string>([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif'],
]);

export function getAllowedExtension(mimeType: string): string {
  const extension = allowedMimeTypes.get(mimeType);

  if (!extension) {
    throw new StorageError(
      'UNSUPPORTED_FILE_TYPE',
      'Solo se permiten imagenes JPG, PNG, WebP o GIF.',
      400,
    );
  }

  return extension;
}

export function parseBase64Image(value: string): Buffer {
  const base64 = value.includes(',') ? value.split(',').at(-1) : value;

  if (!base64 || !/^[a-zA-Z0-9+/=\r\n]+$/.test(base64)) {
    throw new StorageError('INVALID_FILE_DATA', 'La imagen no es valida.', 400);
  }

  return Buffer.from(base64, 'base64');
}

export function assertImageSize(buffer: Buffer): void {
  if (buffer.byteLength === 0 || buffer.byteLength > maxFileSizeBytes) {
    throw new StorageError('INVALID_FILE_SIZE', 'La imagen debe pesar como maximo 2 MB.', 400);
  }
}

export function assertImageMagicBytes(buffer: Buffer, mimeType: string): void {
  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const isPng =
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a;
  const isGif =
    buffer.subarray(0, 6).toString('ascii') === 'GIF87a' ||
    buffer.subarray(0, 6).toString('ascii') === 'GIF89a';
  const isWebp =
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP';

  const matches =
    (mimeType === 'image/jpeg' && isJpeg) ||
    (mimeType === 'image/png' && isPng) ||
    (mimeType === 'image/gif' && isGif) ||
    (mimeType === 'image/webp' && isWebp);

  if (!matches) {
    throw new StorageError(
      'INVALID_FILE_SIGNATURE',
      'El contenido de la imagen no coincide con su tipo.',
      400,
    );
  }
}

export function normalizeFileName(fileName: string): string {
  const nameWithoutExtension = basename(fileName, extname(fileName))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

  return nameWithoutExtension || 'imagen-wormarket';
}

export function getMimeTypeFromFileName(fileName: string): string {
  const extension = extname(fileName).toLowerCase();

  for (const [mimeType, allowedExtension] of allowedMimeTypes.entries()) {
    if (allowedExtension === extension) {
      return mimeType;
    }
  }

  return 'application/octet-stream';
}
