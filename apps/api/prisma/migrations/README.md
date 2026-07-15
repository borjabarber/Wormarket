# Prisma migrations

This directory stores local Prisma Migrate history for Wormarket.

Use the local PostgreSQL service before running migration commands:

```bash
docker compose up -d
npm run db:migrate
```

Create a migration without applying it from the API workspace when review is needed:

```bash
npm run db:migrate:create --workspace=@wormarket/api -- --name migration_name
```

The current schema has no domain models yet, so no initial SQL migration is committed in this task.
