import { createNestApplication } from './bootstrap';

async function bootstrap(): Promise<void> {
  const app = await createNestApplication();
  const port = Number(process.env['PORT'] ?? 3001);

  await app.listen(port);
}

void bootstrap();
