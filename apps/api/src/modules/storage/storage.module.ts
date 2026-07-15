import { Module } from '@nestjs/common';

import { TOKEN_SERVICE } from '../identity/application/ports/token-service';
import { HmacTokenService } from '../identity/infrastructure/crypto/hmac-token.service';
import { STORAGE_SERVICE, type StorageService } from './application/ports/storage-service';
import { LocalStorageService } from './infrastructure/local/local-storage.service';
import { SupabaseStorageService } from './infrastructure/supabase/supabase-storage.service';
import { StorageController } from './presentation/storage.controller';

function createStorageService(): StorageService {
  const storageDriver = process.env['STORAGE_DRIVER'] ?? 'local';

  if (storageDriver === 'local') {
    return new LocalStorageService();
  }

  if (storageDriver === 'supabase') {
    return new SupabaseStorageService();
  }

  throw new Error(`Unsupported storage driver "${storageDriver}".`);
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
