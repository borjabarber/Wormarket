import { defineConfig } from 'prisma/config';

const databaseUrl =
  process.env['DATABASE_URL'] ?? 'postgresql://wormarket:wormarket@localhost:5432/wormarket';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: databaseUrl,
  },
});
