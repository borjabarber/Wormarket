import 'reflect-metadata';

import type { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { isAllowedFrontendOrigin } from './config/frontend-origins';
import { loadLocalEnv } from './config/load-local-env';

export function configureNestApplication(app: INestApplication): void {
  app.enableCors({
    origin(origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) {
      callback(null, isAllowedFrontendOrigin(origin));
    },
    credentials: true,
  });
}

export async function createNestApplication(): Promise<INestApplication> {
  loadLocalEnv();

  const app = await NestFactory.create(AppModule);
  configureNestApplication(app);

  return app;
}
