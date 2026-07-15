import { describe, expect, it, vi } from 'vitest';

import { StorageError } from '../../application/errors/storage-error';
import { SupabaseStorageService } from './supabase-storage.service';

const pngBase64 = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
]).toString('base64');

function createSupabaseClientMock(options?: { uploadError?: boolean }) {
  const upload = vi.fn().mockResolvedValue({
    data: options?.uploadError ? null : { path: 'listings/generated-portal.png' },
    error: options?.uploadError ? { message: 'bucket is not writable' } : null,
  });
  const getPublicUrl = vi.fn().mockReturnValue({
    data: {
      publicUrl: 'https://storage.wormarket.test/listings/generated-portal.png',
    },
  });
  const download = vi.fn().mockResolvedValue({
    data: {
      arrayBuffer: () => Promise.resolve(Buffer.from(pngBase64, 'base64').buffer),
    },
    error: null,
  });
  const from = vi.fn().mockReturnValue({
    download,
    getPublicUrl,
    upload,
  });

  return {
    client: {
      storage: {
        from,
      },
    },
    download,
    from,
    getPublicUrl,
    upload,
  };
}

describe('SupabaseStorageService', () => {
  it('uploads validated listing images to the configured Supabase bucket', async () => {
    const supabase = createSupabaseClientMock();
    const service = new SupabaseStorageService(supabase.client, {
      bucket: 'wormarket-listing-images',
      serviceRoleKey: 'service-role-key',
      supabaseUrl: 'https://wormarket.supabase.co',
    });

    const storedImage = await service.upload({
      dataBase64: pngBase64,
      fileName: 'Portal raro.png',
      mimeType: 'image/png',
    });

    expect(supabase.from).toHaveBeenCalledWith('wormarket-listing-images');
    expect(supabase.upload).toHaveBeenCalledWith(
      expect.stringMatching(/^listings\/.+-portal-raro\.png$/),
      expect.any(Buffer),
      {
        cacheControl: '31536000',
        contentType: 'image/png',
        upsert: false,
      },
    );
    expect(supabase.getPublicUrl).toHaveBeenCalledWith('listings/generated-portal.png');
    expect(storedImage).toMatchObject({
      fileName: 'listings/generated-portal.png',
      mimeType: 'image/png',
      path: 'https://storage.wormarket.test/listings/generated-portal.png',
      url: 'https://storage.wormarket.test/listings/generated-portal.png',
    });
  });

  it('maps Supabase upload failures to a public storage error', async () => {
    const supabase = createSupabaseClientMock({ uploadError: true });
    const service = new SupabaseStorageService(supabase.client, {
      bucket: 'wormarket-listing-images',
      serviceRoleKey: 'service-role-key',
      supabaseUrl: 'https://wormarket.supabase.co',
    });

    await expect(
      service.upload({
        dataBase64: pngBase64,
        fileName: 'Portal raro.png',
        mimeType: 'image/png',
      }),
    ).rejects.toMatchObject({
      code: 'STORAGE_UPLOAD_FAILED',
      statusCode: 502,
    });
  });

  it('rejects files whose content does not match the declared MIME type', async () => {
    const supabase = createSupabaseClientMock();
    const service = new SupabaseStorageService(supabase.client, {
      bucket: 'wormarket-listing-images',
      serviceRoleKey: 'service-role-key',
      supabaseUrl: 'https://wormarket.supabase.co',
    });

    await expect(
      service.upload({
        dataBase64: Buffer.from('not-a-png').toString('base64'),
        fileName: 'fake.png',
        mimeType: 'image/png',
      }),
    ).rejects.toBeInstanceOf(StorageError);
  });
});
