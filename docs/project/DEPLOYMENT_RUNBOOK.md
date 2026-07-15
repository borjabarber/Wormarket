# Wormarket Deployment Runbook

Guia operativa para desplegar y validar Wormarket en produccion gratuita con GitHub, Vercel y Supabase.

## Estado actual

- Proyecto: Wormarket.
- Repositorio: `borjabarber/Wormarket`.
- URL publica: `https://wormarket.vercel.app`.
- Proveedores: GitHub, Vercel Free y Supabase Free.
- Coste objetivo: `0 EUR`.
- Frontend: Next.js en Vercel.
- API: NestJS empaquetada como funcion serverless bajo `/api`.
- Base de datos: Supabase PostgreSQL.
- Imagenes: Supabase Storage en el bucket `wormarket-listing-images`.
- Tiempo real inicial: polling REST con TanStack Query. Socket.IO queda para desarrollo local.

## Documentacion relacionada

- Plan de despliegue: `docs/project/DEPLOYMENT_PLAN.md`.
- Variables de produccion: `docs/project/PRODUCTION_ENV.md`.
- PostgreSQL Supabase: `docs/project/SUPABASE_POSTGRES.md`.
- Storage Supabase: `docs/project/SUPABASE_STORAGE.md`.
- API serverless en Vercel: `docs/project/VERCEL_SERVERLESS_API.md`.
- Estrategia realtime: `docs/project/REALTIME_STRATEGY.md`.
- Health checks: `docs/project/HEALTH_CHECKS.md`.
- Usuarios demo: `docs/project/DEMO_USERS.md`.

## Configuracion de Vercel

Al importar el repositorio desde GitHub:

| Campo | Valor |
| --- | --- |
| Framework | Next.js |
| Root Directory | `./` |
| Install Command | `npm install` |
| Build Command | `npm run db:generate && npm run build:web` |
| Output Directory | `apps/web/.next` |

`vercel.json` enruta `/api/:path*` a la funcion serverless `/api`, donde `api/index.ts` adapta el backend NestJS.

## Variables de entorno en Vercel

Configurar estas variables en Production. No guardar valores reales en el repositorio.

| Variable | Tipo | Uso |
| --- | --- | --- |
| `NODE_ENV` | Publica de runtime | `production`. |
| `NEXT_PUBLIC_API_URL` | Publica | Debe ser `/api`. |
| `NEXT_PUBLIC_REALTIME_MODE` | Publica | `polling`. |
| `FRONTEND_URL` | Publica de runtime | `https://wormarket.vercel.app`. |
| `DATABASE_URL` | Secreta | Pooler transaction-mode de Supabase para runtime. |
| `DIRECT_URL` | Secreta | Conexion directa/session-mode de Supabase para migraciones. |
| `JWT_ACCESS_SECRET` | Secreta | Firma de access tokens. |
| `JWT_REFRESH_SECRET` | Secreta | Firma de refresh tokens. |
| `STORAGE_DRIVER` | Publica de runtime | `supabase`. |
| `SUPABASE_URL` | Publica de runtime | URL del proyecto Supabase. |
| `SUPABASE_SERVICE_ROLE_KEY` | Secreta | Service role key solo en servidor. |
| `SUPABASE_STORAGE_BUCKET` | Publica de runtime | `wormarket-listing-images`. |

## Variables locales para operar Supabase

Crear `.env.supabase.local` en la raiz usando `.env.supabase.example` como referencia. Este archivo esta ignorado por Git y sirve para migraciones, seed y limpieza e2e contra Supabase.

Debe contener, como minimo:

```bash
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

Si se van a probar subidas de imagenes contra Supabase tambien necesita:

```bash
STORAGE_DRIVER="supabase"
SUPABASE_URL="https://..."
SUPABASE_SERVICE_ROLE_KEY="..."
SUPABASE_STORAGE_BUCKET="wormarket-listing-images"
```

## Despliegue desde cero

1. Clonar el repositorio.

```bash
git clone https://github.com/borjabarber/Wormarket.git
cd Wormarket
npm install
```

2. Crear `.env.supabase.local` desde `.env.supabase.example` y rellenarlo con las credenciales de Supabase.

3. Aplicar migraciones en Supabase.

```bash
npm run db:migrate:supabase
```

4. Cargar datos demo controlados.

```bash
npm run db:seed:supabase
```

5. Importar el repositorio en Vercel con la configuracion indicada en esta guia.

6. Crear las variables de entorno de Production en Vercel.

7. Ejecutar el deploy desde Vercel.

8. Validar la URL publica.

```bash
npm run health:public
npm run test:e2e:public
npm run test:e2e:cleanup:supabase
```

## Validacion antes de dar el despliegue por bueno

Comprobaciones locales recomendadas antes de subir cambios:

```bash
npm run format
npm run lint
npm run typecheck
npm run test
npm run build
```

Comprobaciones contra produccion:

```bash
npm run health:public
npm run test:e2e:public
npm run test:e2e:cleanup:supabase
```

GitHub Actions debe quedar en verde en la rama `main` antes de considerar estable el cambio.

## Usuarios demo

Todos los usuarios demo usan la contrasena:

```text
WormarketDemo123!
```

| Rol | Email |
| --- | --- |
| Vendedor | `vendedor@demo.wormarket.local` |
| Comprador | `comprador@demo.wormarket.local` |
| Comprador 2 | `comprador2@demo.wormarket.local` |
| Moderador | `moderador@demo.wormarket.local` |
| Admin | `zerodev@demo.wormarket.local` |
| General | `braismoure@demo.wormarket.local` |

La fuente completa esta en `docs/project/DEMO_USERS.md`.

## Limpieza de datos e2e

Las pruebas e2e publicas crean usuarios, anuncios, ofertas, conversaciones, transacciones, valoraciones y notificaciones temporales con nombres `E2E`. Al terminar deben limpiarse automaticamente.

Si queda cualquier residuo visible:

```bash
npm run test:e2e:cleanup:supabase
```

El comando usa `.env.supabase.local`, no imprime secretos y elimina artefactos e2e de Supabase.

## Resolucion de problemas

| Sintoma | Revision |
| --- | --- |
| `/api/health` devuelve 500 | Revisar `DATABASE_URL`, `DIRECT_URL`, secretos JWT y que Supabase este activo. |
| `/api/health/ready` falla | Revisar conexion a PostgreSQL y estado del proyecto Supabase. |
| La home muestra 0 anuncios | Ejecutar `npm run db:seed:supabase` y comprobar que Vercel apunta a la base correcta. |
| El detalle de anuncio dice no encontrado | Revisar rewrites de `vercel.json`, `api/index.ts` y que el slug exista en Supabase. |
| Login falla en produccion | Revisar seed demo, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` y `FRONTEND_URL`. |
| Fallan subidas de imagenes | Revisar `STORAGE_DRIVER`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` y bucket `wormarket-listing-images`. |
| Aparecen datos `E2E` publicos | Ejecutar `npm run test:e2e:cleanup:supabase` y repetir la validacion publica. |

## Seguridad

- No commitear `.env`, `.env.local`, `.env.supabase.local` ni `.env.vercel.local`.
- No pegar secretos reales en documentacion, issues, commits ni logs.
- `SUPABASE_SERVICE_ROLE_KEY` solo debe existir en servidor.
- `NEXT_PUBLIC_*` puede verse en el navegador; no usarlo para secretos.
- Mantener `NEXT_PUBLIC_API_URL=/api` en produccion para evitar URLs fijas.

## Decisiones conocidas

- No se usa Render para evitar servicios que se duermen o coste adicional.
- No se usa Cloudinary en esta fase; Supabase Storage cubre las imagenes.
- No se usa Supabase Realtime en produccion inicial; el modo elegido es polling REST.
- No se crean tags ni releases sin aprobacion explicita.
