# Plan de despliegue gratuito de Wormarket

## Estado

Fase activa: `Despliegue`.

La fase local esta aprobada. El despliegue debe hacerse con coste inicial `0`, guiado paso a paso y sin guardar secretos en el repositorio.

## Decision de despliegue

La estrategia oficial para la fase de despliegue pasa a ser:

```text
Repositorio        -> GitHub
Aplicacion web/API -> Vercel
Base de datos      -> Supabase PostgreSQL
Imagenes           -> Supabase Storage
```

Se retiran del plan por simplicidad y coste:

- Render.
- Cloudinary.

## Motivos

- Vercel y Supabase tienen planes gratuitos adecuados para una demo academica.
- Render gratuito puede entrar en reposo y provocar arranques lentos antes de la defensa.
- Supabase ya cubre PostgreSQL y Storage, por lo que no hace falta sumar Cloudinary.
- Reducir proveedores facilita la configuracion para un primer despliegue.

Fuentes oficiales de referencia:

- Vercel Pricing: `https://vercel.com/pricing`
- Vercel Functions: `https://vercel.com/docs/functions`
- Supabase Pricing: `https://supabase.com/pricing`
- Supabase Storage: `https://supabase.com/docs/guides/storage`

## Arquitectura objetivo

```text
Usuario
  |
  v
Vercel
  |- Next.js frontend
  |- API serverless NestJS bajo /api
  |
  v
Supabase
  |- PostgreSQL
  |- Storage para imagenes
  |- Polling REST inicial para chat/notificaciones
  |- Supabase Realtime opcional como mejora posterior
```

## Riesgo tecnico principal

El backend actual es NestJS y ya tiene una entrada serverless inicial para Vercel en `api/[...path].ts`. Esa funcion reutiliza el bootstrap de `apps/api`, cachea la aplicacion NestJS por instancia y sirve los controladores actuales bajo `/api`.

La estrategia elegida para la primera URL publica es:

- mantener el monorepo en un solo proyecto Vercel,
- construir el frontend Next.js desde `apps/web`,
- exponer la API NestJS desde `api/[...path].ts`,
- configurar `NEXT_PUBLIC_API_URL=/api`.

Socket.IO queda limitado al desarrollo local para el primer despliegue. La estrategia inicial de produccion sera polling REST con TanStack Query para chat y notificaciones, documentada en `docs/project/REALTIME_STRATEGY.md`. Supabase Realtime queda como mejora posterior si aporta valor antes de la demo final.

## Repositorio GitHub

Repositorio creado:

```text
https://github.com/borjabarber/Wormarket.git
```

El repositorio remoto responde y ya contiene el monorepo local en la rama `main`.

Commits iniciales:

- `6fd3bba`: monorepo inicial de Wormarket.

## Proyecto Vercel

Repositorio conectado/importado en Vercel:

```text
Repositorio: borjabarber/Wormarket
Root Directory: ./
Framework Preset: Next.js u Other si Vercel no autodetecta Next.js por ser monorepo
Install Command: npm install
Build Command: npm run db:generate && npm run build:web
Output Directory: apps/web/.next
```

La raiz debe mantenerse en `./` para incluir tanto `apps/web` como la funcion serverless `api/[...path].ts`. El build debe ejecutar `npm run db:generate` antes de `npm run build:web` porque el cliente Prisma generado no esta versionado y la API serverless lo importa en runtime.

Variables de entorno configuradas en Vercel desde un archivo local temporal `.env.vercel.local`, ignorado por Git. No se han registrado valores reales en la documentacion ni en el repositorio.

Despliegue publico operativo:

```text
URL publica: https://wormarket.vercel.app
Health check: https://wormarket.vercel.app/api/health
```

`GET /api/health` responde `200 OK`. El catalogo usa los datos demo controlados cargados en Supabase.
Los health checks de despliegue quedan documentados en `docs/project/HEALTH_CHECKS.md`:

- `GET /api/health`: liveness compatible con la URL publica existente.
- `GET /api/health/live`: liveness explicito de API.
- `GET /api/health/ready`: readiness con comprobacion ligera de PostgreSQL.

El comando `npm run health:public` valida los tres endpoints contra `https://wormarket.vercel.app` o contra `PUBLIC_BASE_URL`.
Las rutas profundas de API se enrutan a NestJS mediante `rewrites` en `vercel.json`, incluyendo `GET /api/listings/:slug` para el detalle publico de anuncios.

## Proyecto Supabase

Proyecto creado en Supabase:

```text
Organizacion: borjabarber
Nombre de proyecto: wormarket
Plan: Free
```

No se han guardado contrasenas, cadenas de conexion ni claves de Supabase en el repositorio. La configuracion de PostgreSQL se realizara en la siguiente tarea copiando los valores desde el panel de Supabase a entornos locales o Vercel, nunca a archivos versionados.

PostgreSQL Supabase queda configurado en el codigo para trabajar con dos variables:

- `DATABASE_URL`: conexion de runtime de la aplicacion.
- `DIRECT_URL`: conexion directa para migraciones Prisma.

La siguiente tarea ejecutara migraciones contra Supabase solo despues de confirmar manualmente que ambas cadenas apuntan al proyecto correcto.

## Variables de entorno previstas

No guardar valores reales en Git. Solo documentar nombres.

La referencia detallada vive en `docs/project/PRODUCTION_ENV.md` y la plantilla versionada en `.env.production.example`.

```env
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_API_URL=
FRONTEND_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
STORAGE_DRIVER=supabase
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=
```

Secretos:

- `DATABASE_URL`
- `DIRECT_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`

Variables publicas:

- `NEXT_PUBLIC_API_URL`

Notas:

- `DIRECT_URL` queda cableado en Prisma para el flujo Supabase/Prisma y se usara en migraciones controladas.
- `STORAGE_DRIVER=supabase` activa el adaptador backend de Supabase Storage para imagenes de anuncios.
- El bucket publico previsto es `wormarket-listing-images` y debe existir antes de probar subidas en Vercel.

## Tareas externas del usuario

El usuario tendra que hacer manualmente:

- Crear o iniciar sesion en GitHub.
- Crear el repositorio vacio.
- Crear o iniciar sesion en Vercel.
- Autorizar Vercel para leer el repositorio.
- Crear o iniciar sesion en Supabase.
- Crear el proyecto Supabase. Completado con organizacion `borjabarber`.
- Copiar cadenas de conexion y claves desde Supabase.
- Pegar variables de entorno en Vercel.

Codex debe guiar cada paso cuando llegue, indicando exactamente que boton o campo usar.

## Orden recomendado

1. Crear repositorio GitHub.
2. Subir monorepo local.
3. Revisar `.env.example` para produccion.
4. Crear proyecto Supabase.
5. Configurar PostgreSQL.
6. Ejecutar migraciones Prisma.
7. Adaptar Supabase Storage. Completado a nivel de codigo y documentacion.
8. Revisar estrategia realtime. Completado: produccion inicial usara polling REST.
9. Preparar API para Vercel. Completado con `vercel.json` y funcion catch-all `/api`.
10. Conectar Vercel al repositorio. Completado con raiz `./` y comandos de build verificados.
11. Configurar variables de entorno. Completado desde `.env.vercel.local` local ignorado por Git.
12. Desplegar. Completado: frontend publico y health check API operativos.
13. Cargar seed demo controlado. Completado con `db:seed:supabase`.
14. Configurar GitHub Actions final. Completado con CI gratuita, PostgreSQL local, migraciones, seed, calidad, tests, build y audit.
15. Configurar health checks. Completado con liveness, readiness y script `health:public`.
16. Probar flujo completo en URL publica.
17. Documentar despliegue.

## Comprobaciones antes de desplegar

```bash
npm run format
npm run lint
npm run typecheck
npm run test
npm run build
```

Tambien hay que comprobar:

- `.env` y secretos no versionados.
- `.env.example` sin valores reales.
- migraciones Prisma presentes.
- seed demo controlado.
- README actualizado.

## Comprobaciones despues de desplegar

- Abrir URL publica de Vercel.
- Comprobar health checks con `npm run health:public`.
- Iniciar sesion con usuario demo.
- Explorar anuncios.
- Probar detalle, favoritos y ofertas.
- Probar publicacion si Storage ya esta adaptado.
- Revisar logs de Vercel.
- Confirmar datos demo en Supabase. Completado: seed demo idempotente cargado con 13 anuncios y usuarios de prueba.

## Coste previsto

Coste inicial esperado: `0 euros`.

No se configura dominio personalizado de pago. No se contratan planes Pro. Si algun panel solicita tarjeta o activar pago, se debe parar y revisar antes de continuar.
