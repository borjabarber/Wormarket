import { Module } from '@nestjs/common';

import { TOKEN_SERVICE } from '../identity/application/ports/token-service';
import { HmacTokenService } from '../identity/infrastructure/crypto/hmac-token.service';
import { STORAGE_SERVICE } from './application/ports/storage-service';
import { LocalStorageService } from './infrastructure/local/local-storage.service';
import { StorageController } from './presentation/storage.controller';

function createStorageService(): LocalStorageService {
  const storageDriver = process.env['STORAGE_DRIVER'] ?? 'local';

  if (storageDriver !== 'local') {
    throw new Error(`Unsupported storage driver "${storageDriver}" during local development.`);
  }

  return new LocalStorageService();
}

@Module({
  controllers: [StorageController],
  providers: [
    {
      provide: STORAGE_SERVICE,
      useFactory: createStorageService,
    },
    {
      provide: TOKEN_SERVICE,
      useClass: HmacTokenService,
    },
  ],
})
export class StorageModule {}
