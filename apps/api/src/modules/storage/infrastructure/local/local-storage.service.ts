import { createReadStream } from 'node:fs';
import { mkdir, stat, writeFile } from 'node:fs/promises';
import { basename, extname, join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';

import type { StorageService, StoredFileContent } from '../../application/ports/storage-service';
import type { StoredFileDto, UploadStoredFileDto } from '../../application/dto/storage-upload.dto';
import { StorageError } from '../../application/errors/storage-error';

const maxFileSizeBytes = 2 * 1024 * 1024;
const allowedMimeTypes = new Map<string, string>([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif'],
]);

export class LocalStorageService implements StorageService {
  private readonly uploadRoot = resolve(
    process.cwd(),
    process.env['LOCAL_UPLOAD_PATH'] ?? 'uploads',
  );

  async upload(input: UploadStoredFileDto): Promise<StoredFileDto> {
    const extension = allowedMimeTypes.get(input.mimeType);

    if (!extension) {
      throw new StorageError(
        'UNSUPPORTED_FILE_TYPE',
        'Solo se permiten imagenes JPG, PNG, WebP o GIF.',
        400,
      );
    }

    const buffer = this.parseBase64(input.dataBase64);

    if (buffer.byteLength === 0 || buffer.byteLength > maxFileSizeBytes) {
      throw new StorageError('INVALID_FILE_SIZE', 'La imagen debe pesar como maximo 2 MB.', 400);
    }

    this.assertMagicBytes(buffer, input.mimeType);

    await mkdir(this.uploadRoot, { recursive: true });

    const safeBaseName = this.normalizeFileName(input.fileName);
    const storedFileName = `${Date.now()}-${randomUUID()}-${safeBaseName}${extension}`;
    const storedPath = join(this.uploadRoot, storedFileName);

    await writeFile(storedPath, buffer, { flag: 'wx' });

    return {
      fileName: storedFileName,
      mimeType: input.mimeType,
      path: `/uploads/${storedFileName}`,
      size: buffer.byteLength,
      url: `/uploads/${storedFileName}`,
    };
  }

  async getPublicFile(fileName: string): Promise<StoredFileContent> {
    if (!/^[a-zA-Z0-9._-]+$/.test(fileName)) {
      throw new StorageError('INVALID_FILE_NAME', 'El nombre del archivo no es valido.', 400);
    }

    const filePath = resolve(this.uploadRoot, fileName);

    if (!filePath.startsWith(this.uploadRoot)) {
      throw new StorageError('INVALID_FILE_NAME', 'El nombre del archivo no es valido.', 400);
    }

    try {
      const fileStat = await stat(filePath);
      const mimeType = this.getMimeType(fileName);

      return {
        content: createReadStream(filePath),
        fileName,
        mimeType,
        size: fileStat.size,
      };
    } catch {
      throw new StorageError('FILE_NOT_FOUND', 'La imagen no existe.', 404);
    }
  }

  private parseBase64(value: string): Buffer {
    const base64 = value.includes(',') ? value.split(',').at(-1) : value;

    if (!base64 || !/^[a-zA-Z0-9+/=\r\n]+$/.test(base64)) {
      throw new StorageError('INVALID_FILE_DATA', 'La imagen no es valida.', 400);
    }

    return Buffer.from(base64, 'base64');
  }

  private assertMagicBytes(buffer: Buffer, mimeType: string): void {
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

  private normalizeFileName(fileName: string): string {
    const nameWithoutExtension = basename(fileName, extname(fileName))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60);

    return nameWithoutExtension || 'imagen-wormarket';
  }

  private getMimeType(fileName: string): string {
    const extension = extname(fileName).toLowerCase();

    for (const [mimeType, allowedExtension] of allowedMimeTypes.entries()) {
      if (allowedExtension === extension) {
        return mimeType;
      }
    }

    return 'application/octet-stream';
  }
}
