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

Para probar conexion sin versionar secretos, crea o edita tu `.env` local ignorado por Git:

```env
DATABASE_URL=<copiar desde Supabase>
DIRECT_URL=<copiar desde Supabase>
```

No reemplaces `.env.example` ni `.env.production.example` con valores reales.

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

Las migraciones se ejecutaran en la tarea siguiente: `Ejecutar migraciones Prisma en Supabase`.
