# Supabase PostgreSQL

## Objetivo

Configurar Wormarket para usar Supabase PostgreSQL durante la fase de despliegue sin guardar secretos en el repositorio.

## Proyecto

```text
Organizacion: borjabarber
Proyecto: wormarket
Plan: Free
```

## Variables

Wormarket usa dos cadenas de conexion:

```env
DATABASE_URL=
DIRECT_URL=
```

- `DATABASE_URL`: conexion que usara la aplicacion en runtime.
- `DIRECT_URL`: conexion directa que usara Prisma para migraciones.

Ambas son secretas. No deben pegarse en el chat, capturas, commits, README ni documentos versionados.

## Donde copiarlas en Supabase

En el panel de Supabase:

1. Abre el proyecto `wormarket`.
2. Ve a `Project Settings`.
3. Entra en `Database`.
4. Busca `Connection string`.
5. Copia la cadena adecuada para runtime como `DATABASE_URL`.
6. Copia la cadena directa para migraciones como `DIRECT_URL`.
7. Sustituye `[YOUR-PASSWORD]` por la contrasena de base de datos del proyecto solo en tu entorno local o en Vercel cuando toque.

Si Supabase muestra varias opciones, usa:

- Pooler/Transaction mode para `DATABASE_URL`, si esta disponible para runtime serverless.
- Direct connection para `DIRECT_URL`, pensada para migraciones.

## Uso local seguro

Para probar conexion sin versionar secretos, copia la plantilla local:

```bash
copy .env.supabase.local.example .env.supabase.local
```

Despues edita `.env.supabase.local` y rellena:

```env
DATABASE_URL=<copiar desde Supabase>
DIRECT_URL=<copiar desde Supabase>
```

No reemplaces `.env.example` ni `.env.production.example` con valores reales. `.env.supabase.local` esta ignorado por Git.

## Prisma 7

Prisma 7 ya no permite `url` ni `directUrl` dentro de `schema.prisma`. Por eso el schema mantiene solo el proveedor:

```prisma
datasource db {
  provider = "postgresql"
}
```

`apps/api/prisma.config.ts` usa `DIRECT_URL` para comandos de migracion cuando existe y cae a `DATABASE_URL` en local si no esta definida.

## Comprobaciones previas a migrar

Antes de ejecutar migraciones contra Supabase:

- Confirma que el proyecto activo es `wormarket`.
- Confirma que las cadenas apuntan a Supabase, no al PostgreSQL local.
- Confirma que no has pegado secretos en archivos versionados.
- Ejecuta `git status --short` y revisa que `.env` no aparece.
- Ejecuta `npm run db:generate`.

## Ejecutar migraciones

El comando preparado para Supabase es:

```bash
npm run db:migrate:supabase
```

Este comando lee `.env.supabase.local`, valida que `DATABASE_URL` y `DIRECT_URL` existan y que apunten a Supabase, y despues ejecuta `prisma migrate deploy` en `apps/api`.

Tambien existe el comando base:

```bash
npm run db:migrate:deploy
```

Usa `db:migrate:deploy` solo si ya has cargado `DATABASE_URL` y `DIRECT_URL` en el entorno del proceso. Para evitar errores y secretos en el historial del terminal, el flujo recomendado es `db:migrate:supabase`.

## Estado de migraciones

El 2026-07-15 se aplicaron correctamente en Supabase PostgreSQL las 11 migraciones existentes del MVP local:

- `20260709102010_add_dimensions`
- `20260709103515_add_users`
- `20260709104711_add_identity_accounts`
- `20260709111125_add_listings`
- `20260709112635_add_favorites`
- `20260709114603_add_offers`
- `20260709120133_add_transactions`
- `20260709125008_add_conversations`
- `20260709130755_add_reviews`
- `20260709132453_add_notifications`
- `20260709134105_add_moderation`

No se cargo seed de demostracion en esta tarea.
