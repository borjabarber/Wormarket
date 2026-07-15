# Variables de entorno de produccion

## Objetivo

Preparar las variables necesarias para desplegar Wormarket con coste `0` usando GitHub, Vercel y Supabase, sin guardar secretos reales en el repositorio.

Este documento no contiene valores reales. Los secretos se copiaran manualmente desde Supabase o se generaran localmente y se pegaran solo en el panel de Vercel cuando llegue la tarea de configuracion.

## Archivos de referencia

- `.env.example`: entorno local.
- `.env.production.example`: plantilla de produccion sin secretos reales.

No crear ni subir:

- `.env`
- `.env.local`
- `.env.production`
- capturas con secretos visibles

## Variables actuales usadas por el codigo

| Variable | Uso | Donde se configurara | Secreta | Estado |
| --- | --- | --- | --- | --- |
| `NODE_ENV` | Modo de ejecucion | Vercel | No | Preparada |
| `NEXT_PUBLIC_API_URL` | URL publica usada por el frontend para llamar a la API | Vercel | No | Requiere URL final de Vercel |
| `FRONTEND_URL` | Origen permitido para CORS | Vercel | No | Requiere URL final de Vercel |
| `DATABASE_URL` | Conexion Prisma/PostgreSQL | Vercel | Si | Se obtendra de Supabase |
| `JWT_ACCESS_SECRET` | Firma de access tokens | Vercel | Si | Se generara antes de configurar Vercel |
| `JWT_REFRESH_SECRET` | Firma de refresh tokens | Vercel | Si | Se generara antes de configurar Vercel |
| `STORAGE_DRIVER` | Seleccion de adaptador de imagenes | Vercel | No | `local` en local, `supabase` cuando exista adaptador |
| `LOCAL_UPLOAD_PATH` | Carpeta local de subidas | Local | No | No se usa en produccion |

## Variables preparadas para tareas posteriores

| Variable | Uso previsto | Donde se configurara | Secreta | Nota |
| --- | --- | --- | --- | --- |
| `DIRECT_URL` | Conexion directa para migraciones Prisma/Supabase | Entorno local o Vercel segun estrategia | Si | Aun no esta cableada en `schema.prisma` |
| `SUPABASE_URL` | URL publica del proyecto Supabase | Vercel | No | Necesaria para Supabase Storage |
| `SUPABASE_SERVICE_ROLE_KEY` | Acceso servidor a Supabase Storage | Vercel | Si | Nunca exponer en cliente |
| `SUPABASE_STORAGE_BUCKET` | Bucket de imagenes | Vercel | No | Valor previsto: `wormarket-listing-images` |

## Valores que dependen de pasos futuros

Todavia no podemos rellenar:

- `NEXT_PUBLIC_API_URL`: depende de la URL final de Vercel y de como adaptemos la API a serverless.
- `FRONTEND_URL`: depende de la URL final de Vercel.
- `DATABASE_URL`: depende de crear el proyecto Supabase.
- `DIRECT_URL`: depende de la estrategia exacta de migraciones con Supabase.
- `SUPABASE_URL`: depende del proyecto Supabase.
- `SUPABASE_SERVICE_ROLE_KEY`: depende del proyecto Supabase.

## Generar secretos JWT

Cuando toque configurar Vercel, genera dos secretos diferentes:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Ejecuta el comando dos veces:

- primera salida para `JWT_ACCESS_SECRET`,
- segunda salida para `JWT_REFRESH_SECRET`.

No pegues esos valores en archivos del repositorio. Solo se pegaran en Vercel como variables secretas.

## Configuracion prevista en Vercel

Cuando llegue la tarea de configurar Vercel, se anadiran estas variables en el panel del proyecto:

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-vercel-project.vercel.app/api
FRONTEND_URL=https://your-vercel-project.vercel.app
DATABASE_URL=<copiar desde Supabase>
JWT_ACCESS_SECRET=<generado localmente>
JWT_REFRESH_SECRET=<generado localmente>
STORAGE_DRIVER=supabase
SUPABASE_URL=<copiar desde Supabase>
SUPABASE_SERVICE_ROLE_KEY=<copiar desde Supabase>
SUPABASE_STORAGE_BUCKET=wormarket-listing-images
```

`DIRECT_URL` se anadira cuando se configure el flujo de migraciones con Supabase si Prisma lo requiere.

## Riesgos conocidos

- `STORAGE_DRIVER=supabase` todavia no funcionara hasta implementar el adaptador Supabase Storage.
- `DIRECT_URL` todavia no se usa en el schema actual de Prisma.
- `NEXT_PUBLIC_API_URL` puede cambiar si finalmente la API vive bajo la misma URL de Vercel o se adapta con otra ruta.
- `SUPABASE_SERVICE_ROLE_KEY` es una clave de servidor y nunca debe aparecer en codigo cliente ni en variables `NEXT_PUBLIC_*`.

## Checklist

- [x] Plantilla `.env.production.example` creada sin secretos reales.
- [x] Variables actuales y futuras separadas.
- [x] Secretos identificados.
- [x] Pasos externos pendientes documentados.
- [x] Supabase Storage marcado como tarea posterior.
