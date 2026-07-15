import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  Inject,
  Param,
  Post,
  StreamableFile,
} from '@nestjs/common';

import { IdentityError } from '../../identity/application/errors/identity-error';
import { TOKEN_SERVICE, type TokenService } from '../../identity/application/ports/token-service';
import type { StoredFileDto, UploadStoredFileDto } from '../application/dto/storage-upload.dto';
import { StorageError } from '../application/errors/storage-error';
import { STORAGE_SERVICE, type StorageService } from '../application/ports/storage-service';

@Controller()
export class StorageController {
  constructor(
    @Inject(STORAGE_SERVICE)
    private readonly storageService: StorageService,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
  ) {}

  @Post('storage/uploads')
  async uploadImage(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: unknown,
  ): Promise<StoredFileDto> {
    return this.mapStorageErrors(async () => {
      this.tokenService.verify(this.parseBearerToken(authorization), 'access');

      return this.storageService.upload(this.parseUploadBody(body));
    });
  }

  @Get('uploads/:fileName')
  async getUploadedImage(@Param('fileName') fileName: string): Promise<StreamableFile> {
    return this.mapStorageErrors(async () => {
      const file = await this.storageService.getPublicFile(fileName);

      return new StreamableFile(file.content, {
        length: file.size,
        type: file.mimeType,
      });
    });
  }

  private parseUploadBody(body: unknown): UploadStoredFileDto {
    if (!this.isRecord(body)) {
      throw this.invalidBodyError();
    }

    const { dataBase64, fileName, mimeType } = body;

    if (
      typeof dataBase64 !== 'string' ||
      typeof fileName !== 'string' ||
      typeof mimeType !== 'string'
    ) {
      throw this.invalidBodyError();
    }

    return {
      dataBase64,
      fileName,
      mimeType,
    };
  }

  private parseBearerToken(authorization: string | undefined): string {
    if (!authorization?.startsWith('Bearer ')) {
      throw new StorageError(
        'INVALID_AUTHORIZATION_HEADER',
        'La cabecera de autorizacion no es valida.',
        401,
      );
    }

    return authorization.slice('Bearer '.length).trim();
  }

  private async mapStorageErrors<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error: unknown) {
      if (error instanceof StorageError) {
        throw new HttpException(
          {
            code: error.code,
            message: error.message,
          },
          error.statusCode,
        );
      }

      if (error instanceof IdentityError) {
        throw new HttpException(
          {
            code: error.code,
            message: error.message,
          },
          error.statusCode,
        );
      }

      throw error;
    }
  }

  private invalidBodyError(): StorageError {
    return new StorageError('INVALID_UPLOAD_BODY', 'La solicitud no es valida.', 400);
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
  }
}
