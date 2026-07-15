import { HttpException } from '@nestjs/common';
import { Readable } from 'node:stream';
import { describe, expect, it } from 'vitest';

import type {
  AuthTokenPayload,
  TokenService,
} from '../../identity/application/ports/token-service';
import type { StorageService } from '../application/ports/storage-service';
import { StorageController } from './storage.controller';

const tokenPayload: AuthTokenPayload = {
  kind: 'access',
  role: 'USER',
  sub: 'user-1',
  username: 'lyra-oraculo',
};

const tokenService: TokenService = {
  hashRefreshToken: () => 'refresh-token-hash',
  issueAccessToken: () => 'access-token',
  issueRefreshToken: () => 'refresh-token',
  verify: () => tokenPayload,
};

describe('StorageController', () => {
  it('uploads images with an authenticated token', async () => {
    let uploadedFileName: string | null = null;
    const storageService: StorageService = {
      getPublicFile: async () => ({
        content: Readable.from([]),
        fileName: 'image.png',
        mimeType: 'image/png',
        size: 8,
      }),
      upload: async (input) => {
        uploadedFileName = input.fileName;

        return {
          fileName: 'image.png',
          mimeType: 'image/png',
          path: '/uploads/image.png',
          size: 8,
          url: '/uploads/image.png',
        };
      },
    };
    const controller = new StorageController(storageService, tokenService);

    await expect(
      controller.uploadImage('Bearer access-token', {
        dataBase64: 'iVBORw0KGgo=',
        fileName: 'portal.png',
        mimeType: 'image/png',
      }),
    ).resolves.toEqual({
      fileName: 'image.png',
      mimeType: 'image/png',
      path: '/uploads/image.png',
      size: 8,
      url: '/uploads/image.png',
    });
    expect(uploadedFileName).toBe('portal.png');
  });

  it('rejects uploads without authorization', async () => {
    const storageService: StorageService = {
      getPublicFile: async () => ({
        content: Readable.from([]),
        fileName: 'image.png',
        mimeType: 'image/png',
        size: 8,
      }),
      upload: async () => ({
        fileName: 'image.png',
        mimeType: 'image/png',
        path: '/uploads/image.png',
        size: 8,
        url: '/uploads/image.png',
      }),
    };
    const controller = new StorageController(storageService, tokenService);

    await expect(controller.uploadImage(undefined, {})).rejects.toBeInstanceOf(HttpException);
  });
});
