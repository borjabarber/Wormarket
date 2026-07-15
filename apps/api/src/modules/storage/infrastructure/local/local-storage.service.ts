import { createReadStream } from 'node:fs';
import { mkdir, stat, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';

import type { StorageService, StoredFileContent } from '../../application/ports/storage-service';
import type { StoredFileDto, UploadStoredFileDto } from '../../application/dto/storage-upload.dto';
import { StorageError } from '../../application/errors/storage-error';
import {
  assertImageMagicBytes,
  assertImageSize,
  getAllowedExtension,
  getMimeTypeFromFileName,
  normalizeFileName,
  parseBase64Image,
} from '../storage-file-rules';

export class LocalStorageService implements StorageService {
  private readonly uploadRoot = resolve(
    process.cwd(),
    process.env['LOCAL_UPLOAD_PATH'] ?? 'uploads',
  );

  async upload(input: UploadStoredFileDto): Promise<StoredFileDto> {
    const extension = getAllowedExtension(input.mimeType);
    const buffer = parseBase64Image(input.dataBase64);

    assertImageSize(buffer);
    assertImageMagicBytes(buffer, input.mimeType);

    await mkdir(this.uploadRoot, { recursive: true });

    const safeBaseName = normalizeFileName(input.fileName);
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
      const mimeType = getMimeTypeFromFileName(fileName);

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
}
