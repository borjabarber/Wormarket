# API serverless en Vercel

## Objetivo

Preparar Wormarket para desplegar frontend y API en un unico proyecto gratuito de Vercel, sin Render y sin servidor persistente.

## Estructura

- `apps/api/src/bootstrap.ts`: crea y configura la aplicacion NestJS compartida.
- `apps/api/src/main.ts`: arranque local con `app.listen(PORT)`.
- `api/[...path].ts`: entrada serverless de Vercel que sirve NestJS bajo `/api`.
- `vercel.json`: configuracion de build desde la raiz del monorepo.
- `tsconfig.json`: typecheck de la entrada serverless y del backend importado.

## Rutas

En local, la API sigue escuchando en:

```text
http://localhost:3001
```

En Vercel, la API se expone bajo el mismo dominio del frontend:

```text
/api
```

Ejemplos:

```text
/api/health
/api/listings
/api/identity/login
```

La funcion `api/[...path].ts` elimina el prefijo `/api` antes de entregar la peticion a NestJS, porque los controladores existentes siguen definidos como `/health`, `/listings`, `/identity/login`, etc.

## Variables

En Vercel, configurar:

```env
NEXT_PUBLIC_API_URL=/api
FRONTEND_URL=https://your-vercel-project.vercel.app
NEXT_PUBLIC_REALTIME_MODE=polling
```

El resto de secretos (`DATABASE_URL`, `DIRECT_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`) deben configurarse solo en el panel de Vercel y nunca en archivos versionados.

## Limitaciones

- Socket.IO queda para desarrollo local en el primer despliegue.
- Chat y notificaciones usaran polling REST con `NEXT_PUBLIC_REALTIME_MODE=polling`.
- La funcion serverless cachea la instancia de NestJS por instancia de Vercel, pero no debe guardar estado de negocio en memoria.
- Supabase PostgreSQL y Supabase Storage son las fuentes persistentes.

## Comprobaciones

Antes de conectar Vercel:

```bash
npm run typecheck:vercel
npm run typecheck
npm run build
```

Despues de desplegar:

```text
GET https://your-vercel-project.vercel.app/api/health
```

Debe devolver el health check de Wormarket.
