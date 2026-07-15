import { randomUUID } from 'node:crypto';
import { Readable } from 'node:stream';

import { createClient } from '@supabase/supabase-js';

import type { StoredFileDto, UploadStoredFileDto } from '../../application/dto/storage-upload.dto';
import { StorageError } from '../../application/errors/storage-error';
import type { StorageService, StoredFileContent } from '../../application/ports/storage-service';
import {
  assertImageMagicBytes,
  assertImageSize,
  getAllowedExtension,
  getMimeTypeFromFileName,
  normalizeFileName,
  parseBase64Image,
} from '../storage-file-rules';

type StorageDownloadBody = {
  arrayBuffer(): Promise<ArrayBuffer>;
};

type SupabaseStorageBucket = {
  download(path: string): Promise<{
    data: StorageDownloadBody | null;
    error: { message: string } | null;
  }>;
  getPublicUrl(path: string): {
    data: {
      publicUrl: string;
    };
  };
  upload(
    path: string,
    body: Buffer,
    options: {
      cacheControl: string;
      contentType: string;
      upsert: false;
    },
  ): Promise<{
    data: { path: string } | null;
    error: { message: string } | null;
  }>;
};

type SupabaseStorageClient = {
  storage: {
    from(bucket: string): SupabaseStorageBucket;
  };
};

type SupabaseStorageConfig = {
  bucket: string;
  serviceRoleKey: string;
  supabaseUrl: string;
};

export class SupabaseStorageService implements StorageService {
  private readonly bucket: string;
  private readonly client: SupabaseStorageClient;

  constructor(client?: SupabaseStorageClient, config?: Partial<SupabaseStorageConfig>) {
    const resolvedConfig = this.resolveConfig(config);

    this.bucket = resolvedConfig.bucket;
    this.client =
      client ??
      createClient(resolvedConfig.supabaseUrl, resolvedConfig.serviceRoleKey, {
        auth: {
          persistSession: false,
        },
      });
  }

  async upload(input: UploadStoredFileDto): Promise<StoredFileDto> {
    const extension = getAllowedExtension(input.mimeType);
    const buffer = parseBase64Image(input.dataBase64);

    assertImageSize(buffer);
    assertImageMagicBytes(buffer, input.mimeType);

    const safeBaseName = normalizeFileName(input.fileName);
    const objectPath = `listings/${Date.now()}-${randomUUID()}-${safeBaseName}${extension}`;
    const bucket = this.client.storage.from(this.bucket);
    const uploadResult = await bucket.upload(objectPath, buffer, {
      cacheControl: '31536000',
      contentType: input.mimeType,
      upsert: false,
    });

    if (uploadResult.error) {
      throw new StorageError('STORAGE_UPLOAD_FAILED', 'No hemos podido guardar la imagen.', 502);
    }

    const publicUrl = bucket.getPublicUrl(uploadResult.data?.path ?? objectPath).data.publicUrl;

    return {
      fileName: uploadResult.data?.path ?? objectPath,
      mimeType: input.mimeType,
      path: publicUrl,
      size: buffer.byteLength,
      url: publicUrl,
    };
  }

  async getPublicFile(fileName: string): Promise<StoredFileContent> {
    this.assertSafeObjectPath(fileName);

    const downloadResult = await this.client.storage.from(this.bucket).download(fileName);

    if (downloadResult.error || !downloadResult.data) {
      throw new StorageError('FILE_NOT_FOUND', 'La imagen no existe.', 404);
    }

    const buffer = Buffer.from(await downloadResult.data.arrayBuffer());

    return {
      content: Readable.from(buffer),
      fileName,
      mimeType: getMimeTypeFromFileName(fileName),
      size: buffer.byteLength,
    };
  }

  private resolveConfig(config?: Partial<SupabaseStorageConfig>): SupabaseStorageConfig {
    const supabaseUrl = config?.supabaseUrl ?? process.env['SUPABASE_URL'];
    const serviceRoleKey = config?.serviceRoleKey ?? process.env['SUPABASE_SERVICE_ROLE_KEY'];
    const bucket =
      config?.bucket ?? process.env['SUPABASE_STORAGE_BUCKET'] ?? 'wormarket-listing-images';

    if (!supabaseUrl) {
      throw new Error('SUPABASE_URL is required when STORAGE_DRIVER=supabase.');
    }

    if (!serviceRoleKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is required when STORAGE_DRIVER=supabase.');
    }

    if (!bucket) {
      throw new Error('SUPABASE_STORAGE_BUCKET is required when STORAGE_DRIVER=supabase.');
    }

    return {
      bucket,
      serviceRoleKey,
      supabaseUrl,
    };
  }

  private assertSafeObjectPath(fileName: string): void {
    const isSafePath =
      /^[a-zA-Z0-9][a-zA-Z0-9._/-]+$/.test(fileName) &&
      !fileName.includes('..') &&
      !fileName.startsWith('/') &&
      !fileName.endsWith('/');

    if (!isSafePath) {
      throw new StorageError('INVALID_FILE_NAME', 'El nombre del archivo no es valido.', 400);
    }
  }
}
