import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { StorageError } from '../../application/errors/storage-error';
import { LocalStorageService } from './local-storage.service';

const pngBase64 = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
]).toString('base64');

describe('LocalStorageService', () => {
  let uploadRoot: string;
  let previousUploadPath: string | undefined;

  beforeEach(async () => {
    previousUploadPath = process.env['LOCAL_UPLOAD_PATH'];
    uploadRoot = await mkdtemp(join(tmpdir(), 'wormarket-storage-'));
    process.env['LOCAL_UPLOAD_PATH'] = uploadRoot;
  });

  afterEach(async () => {
    if (previousUploadPath === undefined) {
      delete process.env['LOCAL_UPLOAD_PATH'];
    } else {
      process.env['LOCAL_UPLOAD_PATH'] = previousUploadPath;
    }

    await rm(uploadRoot, { force: true, recursive: true });
  });

  it('stores valid local images outside the repository data model', async () => {
    const service = new LocalStorageService();

    const storedImage = await service.upload({
      dataBase64: pngBase64,
      fileName: 'Portal raro.png',
      mimeType: 'image/png',
    });

    expect(storedImage.url).toMatch(/^\/uploads\/.+portal-raro\.png$/);
    await expect(readFile(join(uploadRoot, storedImage.fileName))).resolves.toBeInstanceOf(Buffer);
  });

  it('rejects files whose content does not match the declared MIME type', async () => {
    const service = new LocalStorageService();

    await expect(
      service.upload({
        dataBase64: Buffer.from('not-a-png').toString('base64'),
        fileName: 'fake.png',
        mimeType: 'image/png',
      }),
    ).rejects.toBeInstanceOf(StorageError);
  });
});
