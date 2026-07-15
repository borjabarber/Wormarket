import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { isAllowedFrontendOrigin } from './config/frontend-origins';
import { loadLocalEnv } from './config/load-local-env';

async function bootstrap(): Promise<void> {
  loadLocalEnv();

  const app = await NestFactory.create(AppModule);
  const port = Number(process.env['PORT'] ?? 3001);

  app.enableCors({
    origin(origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) {
      callback(null, isAllowedFrontendOrigin(origin));
    },
    credentials: true,
  });

  await app.listen(port);
}

void bootstrap();
