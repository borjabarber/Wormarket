import type { StoredFileDto, UploadStoredFileDto } from '../dto/storage-upload.dto';
import type { Readable } from 'node:stream';

export const STORAGE_SERVICE = Symbol('STORAGE_SERVICE');

export type StoredFileContent = {
  content: Readable;
  fileName: string;
  mimeType: string;
  size: number;
};

export type StorageService = {
  getPublicFile(fileName: string): Promise<StoredFileContent>;
  upload(input: UploadStoredFileDto): Promise<StoredFileDto>;
};
