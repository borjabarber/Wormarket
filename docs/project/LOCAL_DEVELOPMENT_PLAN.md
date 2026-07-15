# Plan de desarrollo local

La fase local busca una aplicacion completa, demostrable y estable sin depender de servicios cloud.

## Alcance

- Frontend local en Next.js.
- Backend local en NestJS.
- PostgreSQL en Docker.
- Prisma con migraciones locales.
- Seed local de demostracion.
- Imagenes mediante adaptador local.
- Chat y notificaciones mediante Socket.IO local.

## Flujo previsto

```text
Preparacion documental
  -> monorepo
  -> frontend y backend base
  -> dominio y persistencia
  -> funcionalidades del MVP
  -> integracion
  -> tests y pulido
  -> validacion local
```

## Restricciones

No se activan Vercel, Render, Supabase ni Cloudinary en esta fase.

## Definition of Done local

- `npm install` funciona.
- `docker compose up -d` inicia PostgreSQL.
- Migraciones y seed funcionan.
- Frontend y backend arrancan.
- Flujo principal del marketplace funciona en local.
- Linter, TypeScript y pruebas relevantes pasan.
- Documentacion, logs, changelog y versionado estan actualizados.
