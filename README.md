
![Banner](./imagenes_ads/gitbanner.png)
# Wormarket

Wormarket es un marketplace interdimensional de objetos imposibles.

El proyecto se desarrolla como Trabajo de Fin de Master y sigue una evolucion incremental: primero una aplicacion completa y demostrable en local, despues una fase de despliegue controlada.

## Descripcion general del proyecto

Wormarket es una plataforma web de compraventa ficticia donde usuarios de distintas dimensiones pueden explorar, publicar, guardar, negociar y valorar objetos imposibles. Aunque el universo narrativo es fantastico, la aplicacion esta construida como un marketplace real: tiene autenticacion, perfiles, anuncios, favoritos, ofertas, chat, transacciones, valoraciones, notificaciones y moderacion.

El objetivo academico es demostrar una aplicacion full stack local con arquitectura modular, backend API REST, frontend responsive, persistencia PostgreSQL, autenticacion, autorizacion, tiempo real, pruebas, seguridad basica, accesibilidad y documentacion tecnica.

## Estado actual

- Fase activa: Despliegue.
- Version actual: `1.0.1`.
- Estado: fase local aprobada con backend y frontend completos para el MVP local, autenticacion, anuncios, favoritos, ofertas, chat, transacciones, valoraciones, notificaciones, moderacion, subida local de imagenes, seed visual, demo limpia, pruebas principales ejecutadas y documentacion reorganizada para entrega academica.
- Repositorio GitHub de despliegue: `https://github.com/borjabarber/Wormarket.git`.

## Stack tecnologico utilizado

Frontend:

- Next.js con App Router.
- React.
- TypeScript estricto.
- CSS propio con tokens de diseno.
- TanStack Query.
- React Hook Form.
- Zod.
- Socket.IO Client.
- React Testing Library y Vitest.

Backend:

- NestJS.
- TypeScript.
- Prisma.
- PostgreSQL.
- Socket.IO.
- JWT local.
- Supertest y Vitest.

Calidad, entorno y herramientas:

- Monorepo con npm workspaces.
- ESLint.
- Prettier.
- Docker y Docker Compose.
- GitHub Actions para CI final gratuita.
- Scripts locales para seed, migraciones, smoke test y flujo e2e.

## Instalacion y ejecucion

Requisitos:

- Node.js compatible con el monorepo.
- npm.
- Docker Desktop abierto.
- Puertos locales libres: `3000`, `3001` y `5432`.

Instala dependencias y prepara la base local:

```bash
npm install
docker compose up -d
npm run db:migrate
npm run db:seed
```

Arranca frontend y backend:

```bash
npm run dev
```

URLs locales:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`
- Health check API: `http://localhost:3001/health`
- Readiness API: `http://localhost:3001/health/ready`
- PostgreSQL: `localhost:5432`

Comprobaciones principales:

```bash
npm run format
npm run lint
npm run typecheck
npm run test
npm run build
```

Con API y frontend levantados tambien puedes ejecutar:

```bash
npm run test:integration:local
npm run test:e2e
```

Si una prueba e2e anterior dejo datos temporales, limpia la base local con:

```bash
npm run test:e2e:cleanup
```

## Estructura del proyecto

```text
api/
  [...path].ts
apps/
  web/
    package.json
  api/
    package.json
packages/
  shared-types/
  shared-validation/
  eslint-config/
  typescript-config/
docs/
  project/
  architecture/
  design/
  decisions/
.github/
  workflows/
skills/
skill-evals/
```

## Funcionalidades principales

- Registro e inicio de sesion con access token y refresh token locales.
- Perfiles publicos con avatar, dimension de origen, reputacion y valoraciones.
- Explorador de anuncios con busqueda, filtros por dimension, rareza y estado.
- Detalle de anuncio con imagen, vendedor, precio, rareza, estado y acciones.
- Publicacion y edicion de anuncios propios con imagenes locales.
- Favoritos autenticados.
- Ofertas entre comprador y vendedor, con aceptacion, rechazo y cancelacion.
- Conversaciones y mensajes en tiempo real con Socket.IO.
- Transacciones creadas desde ofertas aceptadas y completadas por comprador.
- Valoraciones tras transacciones completadas.
- Notificaciones con contador de no leidas y eventos en tiempo real.
- Moderacion basica con denuncias, resolucion, bloqueo de anuncios y bloqueo de usuarios.
- Seed local con dimensiones, usuarios demo, anuncios con imagenes, favoritos, ofertas, conversaciones, valoraciones, notificaciones y denuncias.
- Limpieza de artefactos e2e para mantener la demo local presentable.

## Usuarios y contrasenas de prueba

Todos los usuarios demo usan la misma contrasena:

```text
WormarketDemo123!
```

| Proposito         | Email de login                    | Usuario        | Rol         |
| ----------------- | --------------------------------- | -------------- | ----------- |
| Vendedor          | `vendedor@demo.wormarket.local`   | `lyra-oraculo` | `USER`      |
| Comprador         | `comprador@demo.wormarket.local`  | `nadir-cronal` | `USER`      |
| Segundo comprador | `comprador2@demo.wormarket.local` | `vega-umbral`  | `USER`      |
| Moderador         | `moderador@demo.wormarket.local`  | `io-horizonte` | `MODERATOR` |
| Admin             | `zerodev@demo.wormarket.local`    | `zerodev`      | `ADMIN`     |
| General           | `braismoure@demo.wormarket.local` | `braismoure`   | `USER`      |

La lista completa esta en `docs/project/DEMO_USERS.md`.

## Desarrollo local detallado

La guia paso a paso de demostracion esta en `docs/project/LOCAL_DEMO_GUIDE.md`.

## Presentacion TFM

La presentacion horizontal para defender el proyecto esta en `docs/project/Wormarket_TFM_presentation.pdf`.

## Despliegue

El plan de despliegue gratuito esta en `docs/project/DEPLOYMENT_PLAN.md` y la guia operativa paso a paso esta en `docs/project/DEPLOYMENT_RUNBOOK.md`.

Las variables de entorno de produccion estan preparadas en `docs/project/PRODUCTION_ENV.md` y `.env.production.example`. No contienen secretos reales.

La API esta preparada para Vercel mediante `api/[...path].ts`, que expone el backend NestJS bajo `/api` y reutiliza la misma configuracion de CORS que el servidor local. En produccion, `NEXT_PUBLIC_API_URL` debe configurarse como `/api`.

Los health checks de despliegue estan documentados en `docs/project/HEALTH_CHECKS.md`. La URL publica expone:

```text
GET /api/health
GET /api/health/live
GET /api/health/ready
```

Para validarlos contra Vercel:

```bash
npm run health:public
```

## Scripts raiz

La raiz expone los comandos principales del monorepo:

```bash
npm run dev
npm run dev:web
npm run dev:api
npm run build
npm run build:web
npm run build:api
npm run lint
npm run format
npm run format:write
npm run typecheck
npm run typecheck:vercel
npm run test
npm run test:unit
npm run test:e2e
npm run test:e2e:cleanup
npm run test:e2e:cleanup:supabase
npm run test:e2e:public
npm run test:integration:local
npm run health:public
npm run db:generate
npm run db:migrate
npm run db:migrate:create -- --name migration_name
npm run db:migrate:deploy
npm run db:migrate:supabase
npm run db:migrate:status
npm run db:seed
npm run db:reset
```

`npm run dev` arranca frontend y backend en paralelo. Los scripts `test` y `test:unit` ejecutan Vitest en los workspaces configurados. `test:e2e` ejecuta las pruebas HTTP locales de la API y el flujo e2e local de Wormarket contra frontend, backend y base con seed. `test:e2e:cleanup` elimina artefactos e2e locales si una ejecucion anterior dejo usuarios, anuncios, ofertas, transacciones o valoraciones temporales. `test:e2e:cleanup:supabase` hace la misma limpieza contra Supabase leyendo `.env.supabase.local`, sin imprimir secretos. `test:e2e:public` valida la URL publica de Vercel contra Supabase y limpia los datos temporales que crea.

## PostgreSQL local

PostgreSQL se ejecuta mediante Docker Compose:

```bash
docker compose up -d
docker compose ps
docker compose down
```

La base local usa:

```text
DATABASE_URL=postgresql://wormarket:wormarket@localhost:5432/wormarket
```

Los datos persisten en el volumen Docker `wormarket_postgres_data`.

## Prisma

Prisma esta configurado en `@wormarket/api` para usar PostgreSQL local mediante `DATABASE_URL`.

```bash
npm run db:generate
npm run db:migrate
```

El schema inicial vive en `apps/api/prisma/schema.prisma` y las migraciones se guardan en `apps/api/prisma/migrations`.

Comandos de migraciones disponibles:

```bash
npm run db:migrate
npm run db:migrate:create -- --name migration_name
npm run db:migrate:deploy
npm run db:migrate:supabase
npm run db:migrate:status
npm run db:seed:supabase
npm run db:reset
npm run db:migrate --workspace=@wormarket/api
npm run db:migrate:create --workspace=@wormarket/api -- --name migration_name
npm run db:migrate:status --workspace=@wormarket/api
npm run db:reset --workspace=@wormarket/api
```

## Seed local

El seed local se ejecuta contra PostgreSQL local despues de aplicar migraciones:

```bash
docker compose up -d
npm run db:migrate
npm run db:seed
```

El seed actual crea o actualiza de forma idempotente las dimensiones, perfiles publicos, cuentas demo autenticables, 13 anuncios demo, favoritos, ofertas, transacciones, conversaciones, valoraciones, notificaciones y denuncias de demostracion usados por el backend local.

Para cargar los mismos datos demo en Supabase durante despliegue, usa el runner seguro:

```bash
npm run db:seed:supabase
```

El comando lee `.env.supabase.local`, valida que `DATABASE_URL` y `DIRECT_URL` apunten a Supabase, genera Prisma Client y ejecuta el seed sin imprimir secretos.

Los anuncios del seed usan imagenes demo versionadas en `apps/web/public/images/demo/` y rutas publicas `/images/demo/...`. Estas imagenes forman parte del proyecto y permiten que el explorador y el detalle se vean completos aunque `uploads/` este vacio.

Los usuarios locales de prueba estan documentados en `docs/project/DEMO_USERS.md`. Todos usan credenciales ficticias de desarrollo y hashes PBKDF2 generados por el modulo Identity.

## Almacenamiento local

En el entorno local, Wormarket usa un adaptador local de almacenamiento para imagenes de anuncios. La API lee:

```text
STORAGE_DRIVER=local
LOCAL_UPLOAD_PATH=uploads
```

`POST /storage/uploads` requiere `Authorization: Bearer <accessToken>` y recibe imagenes codificadas en base64 desde el frontend. Valida tipo MIME, firma del archivo y tamano maximo de 2 MB por imagen. Los tipos permitidos son JPG, PNG, WebP y GIF.

Los archivos se guardan en `uploads/`, que esta ignorado por Git, y se sirven publicamente desde `GET /uploads/:fileName`. El formulario de publicacion permite combinar URLs existentes con archivos locales, hasta un maximo de 8 imagenes por anuncio.

## Workspaces

La raiz usa npm workspaces:

- `@wormarket/web`
- `@wormarket/api`
- `@wormarket/shared-types`
- `@wormarket/shared-validation`
- `@wormarket/eslint-config`
- `@wormarket/typescript-config`

Las aplicaciones y herramientas reales ya estan configuradas para la fase local.

## TypeScript

El monorepo usa configuraciones compartidas en `packages/typescript-config`.

- `base.json` define TypeScript estricto para todos los workspaces.
- `next.json` se aplica al frontend.
- `nest.json` se aplica al backend.
- `library.json` se aplica a paquetes compartidos.

El comando principal de comprobacion es:

```bash
npm run typecheck
```

## Calidad de codigo

ESLint y Prettier estan configurados desde la raiz.

```bash
npm run lint
npm run format
npm run format:write
```

`npm run lint` valida el monorepo con la configuracion compartida de `packages/eslint-config`.

`npm run format` comprueba formato con Prettier y `npm run format:write` aplica el formato.

## Tests

El monorepo usa Vitest como runner principal y un script Node local para el flujo e2e completo.

```bash
npm run test
npm run test:unit
npm run test:e2e
npm run test:e2e:public
npm run test --workspace=@wormarket/web
npm run test --workspace=@wormarket/api
```

El frontend usa React Testing Library sobre `jsdom`. La API usa Vitest con `@nestjs/testing` y Supertest para la ruta local `GET /health`.

Los paquetes compartidos ejecutan Vitest con `--passWithNoTests` hasta que tengan utilidades runtime que cubrir.

`npm run test:e2e` ejecuta:

- Las pruebas e2e/integracion HTTP de `@wormarket/api`.
- El flujo e2e local de `@wormarket/web` mediante `scripts/local-e2e-flow.mjs`.

El flujo e2e local requiere PostgreSQL, migraciones, seed, API y frontend levantados. Valida:

```text
registro
inicio de sesion
publicacion
busqueda y detalle
oferta
aceptacion
transaccion
valoracion
```

El script usa por defecto `http://localhost:3001` y `http://localhost:3000`. Puede configurarse con `WORMARKET_API_URL`, `NEXT_PUBLIC_API_URL`, `WORMARKET_WEB_URL`, `WORMARKET_DEMO_PASSWORD`, `WORMARKET_E2E_PASSWORD` y `WORMARKET_E2E_VENDOR_EMAIL`.

Al terminar, el flujo e2e ejecuta `scripts/local-e2e-cleanup.mjs` para borrar los datos temporales creados por la prueba y no contaminar perfiles, reputacion ni catalogo demo. Si necesitas limpiar residuos de una ejecucion anterior, ejecuta:

```bash
npm run test:e2e:cleanup
```

Para limpiar residuos E2E de la base de Supabase usada por la URL publica:

```bash
npm run test:e2e:cleanup:supabase
```

`npm run test:e2e:public` ejecuta el flujo principal contra `https://wormarket.vercel.app`: health checks, lecturas publicas, login demo, registro, favoritos, publicacion, detalle, chat REST, oferta, transaccion, valoracion, notificaciones y autorizacion de moderacion. Requiere `.env.supabase.local` local para limpiar los artefactos E2E en Supabase al terminar.

## Integracion local frontend-backend

La integracion local se puede comprobar con un smoke test opcional. Requiere PostgreSQL local, migraciones, seed y los dos servidores levantados:

```bash
docker compose up -d
npm run db:migrate
npm run db:seed
npm run dev
```

En otra terminal:

```bash
npm run test:integration:local
```

El script comprueba `GET /health`, la ruta web `/auth`, lecturas publicas de anuncios, dimensiones, perfiles y valoraciones, login demo de Identity, lecturas privadas de favoritos, ofertas, transacciones, notificaciones, conversaciones y cola de moderacion. Usa por defecto `http://localhost:3001` para API y `http://localhost:3000` para web; pueden cambiarse con `WORMARKET_API_URL` o `NEXT_PUBLIC_API_URL`, `WORMARKET_WEB_URL` y `WORMARKET_DEMO_PASSWORD`.

Esta comprobacion se mantiene como smoke manual local porque depende de levantar servidores web y API. La CI final si levanta PostgreSQL local, aplica migraciones y carga el seed demo antes de ejecutar las comprobaciones de calidad.

## CI final

El workflow final de GitHub Actions vive en `.github/workflows/ci.yml` y usa solo recursos gratuitos del runner: Node.js, npm y un servicio PostgreSQL local de Docker. No despliega, no usa secretos de Supabase y no escribe en servicios cloud.

Ejecuta:

```bash
npm ci
npm run db:generate
npm run db:migrate:deploy
npm run db:seed
npm run format
npm run lint
npm run typecheck
npm run test --workspace=@wormarket/api -- --pool=forks --teardownTimeout=5000
npm run test --workspace=@wormarket/web -- --pool=forks --teardownTimeout=5000
npm run test --workspace=@wormarket/shared-types --workspace=@wormarket/shared-validation --if-present
npm run build
npm audit --audit-level=high
```

La CI no despliega, no configura servicios cloud y no ejecuta migraciones contra bases de datos de produccion. Las variables JWT del workflow son valores ficticios de CI, no secretos reales.

## Frontend Next.js

El workspace `@wormarket/web` ya contiene una aplicacion Next.js con App Router, TypeScript, layout principal inicial, componentes reutilizables basicos, autenticacion local inicial, explorador de anuncios, detalle de anuncio, creacion y edicion de anuncios propios, favoritos autenticados, ofertas, chat, perfil, valoraciones y notificaciones.

Comandos disponibles:

```bash
npm run dev:web
npm run build:web
npm run typecheck --workspace=@wormarket/web
```

La aplicacion local se ejecuta en `http://localhost:3000`. El layout principal incluye skip link, cabecera persistente, navegacion por secciones del MVP, region `main`, footer y una home reorganizada para explorar objetos, publicar y revisar actividad local. El sistema inicial de componentes vive en `apps/web/src/shared/components` e incluye botones, campos de formulario, cards de anuncio, badges de rareza, estados vacios y skeletons.

La ruta `http://localhost:3000/auth` permite crear cuenta, iniciar sesion, comprobar la sesion local y cerrar sesion contra la API local de Identity. El frontend usa `NEXT_PUBLIC_API_URL` para localizar la API, valida formularios con Zod y React Hook Form, consulta la sesion con TanStack Query y guarda tokens solo en `sessionStorage` durante esta fase local.

La seccion `Explorar` de la home consume `GET /listings` desde la API local, muestra anuncios con precio, vendedor, dimension, rareza e imagen disponible, y permite filtrar en cliente por busqueda, dimension, rareza y estado. El estado por defecto muestra anuncios publicados.

La ruta `http://localhost:3000/listings/:slug` consume `GET /listings/:slug` y muestra la ficha del objeto con imagen o placeholder accesible, precio, rareza, estado, descripcion, dimension, fecha de publicacion y vendedor. Los compradores autenticados pueden enviar ofertas desde el detalle, contactar con el vendedor por chat y el vendedor autenticado puede revisar, aceptar o rechazar las ofertas recibidas para ese anuncio.

La ruta `http://localhost:3000/listings/new` permite publicar objetos imposibles con sesion local activa, validacion de formulario, seleccion de dimension y rareza, precio e imagenes locales. La ruta `http://localhost:3000/listings/:slug/edit` permite editar anuncios propios; el enlace de edicion solo se muestra al vendedor autenticado.

La ruta `http://localhost:3000/favorites` lista los anuncios guardados del usuario autenticado. El explorador y el detalle de anuncio muestran una accion para guardar o quitar favoritos usando la sesion local.

La ruta `http://localhost:3000/offers` lista las ofertas enviadas por el usuario autenticado, con estados de carga, error, lista vacia y cancelacion de ofertas pendientes. El detalle de anuncio reutiliza el cliente de Offers para crear ofertas y gestionar las recibidas por el vendedor.

La ruta `http://localhost:3000/conversations` lista las conversaciones del usuario autenticado, con estados de autenticacion, carga, error y vacio. La ruta `http://localhost:3000/conversations/:conversationId` muestra el hilo de mensajes, permite enviar mensajes validados contra la API local y se conecta al gateway Socket.IO local `/conversations` para recibir actualizaciones `message:sent` y `message:read`.

La ruta `http://localhost:3000/profile` muestra el perfil del usuario autenticado con bio, dimension de origen, reputacion, rol, estado y valoraciones recibidas. La ruta `http://localhost:3000/users/:username` muestra perfiles publicos desde `GET /users/:username` y sus valoraciones desde `GET /users/:username/reviews`; el vendedor del detalle de anuncio enlaza a esta ficha publica.

La ruta `http://localhost:3000/transactions` lista transacciones del usuario autenticado, permite completar las pendientes y enviar una valoracion del otro participante cuando la transaccion ya esta completada.

La ruta `http://localhost:3000/notifications` lista notificaciones del usuario autenticado, muestra el contador de no leidas, permite marcar una notificacion o todas como leidas y se conecta al gateway Socket.IO local `/notifications` para recibir `notification:new`.

El frontend configura TanStack Query con una ventana de datos frescos de 60 segundos, cache de 10 minutos, sin reintentos automaticos y sin recarga automatica al reenfocar la pestana. Las imagenes principales de cards, detalle y perfiles declaran `sizes` para mejorar la seleccion de recursos en distintos anchos.

## Backend NestJS

El workspace `@wormarket/api` contiene una aplicacion NestJS con TypeScript, health checks locales y modulos iniciales de dimensiones, usuarios, identidad, anuncios, favoritos, ofertas, transacciones, conversaciones, valoraciones, notificaciones y moderacion.

Comandos disponibles:

```bash
npm run dev:api
npm run build:api
npm run typecheck --workspace=@wormarket/api
```

La API local se ejecuta en `http://localhost:3001`. CORS HTTP acepta solo `FRONTEND_URL`, `http://localhost:3000` y `http://127.0.0.1:3000`; las llamadas sin origen se permiten para herramientas locales como `curl` o tests. Expone:

```text
GET /health
GET /health/live
GET /health/ready
GET /dimensions
GET /users
GET /users/:username
POST /identity/register
POST /identity/login
POST /identity/refresh
GET /identity/me
POST /identity/logout
GET /listings
GET /listings/:slug
POST /listings
PATCH /listings/:slug
GET /favorites
POST /favorites/:listingSlug
DELETE /favorites/:listingSlug
GET /offers
POST /offers
GET /listings/:listingSlug/offers
POST /offers/:offerId/accept
POST /offers/:offerId/reject
POST /offers/:offerId/cancel
GET /notifications
GET /notifications/unread-count
POST /notifications/:notificationId/read
POST /notifications/read-all
GET /transactions
GET /transactions/:transactionId
POST /transactions/from-offer/:offerId
POST /transactions/:transactionId/complete
GET /conversations
GET /conversations/:conversationId
POST /conversations
GET /conversations/:conversationId/messages
POST /conversations/:conversationId/messages
POST /conversations/:conversationId/read
POST /reviews
GET /users/:username/reviews
POST /moderation/reports/listings/:slug
POST /moderation/reports/users/:username
GET /moderation/reports
POST /moderation/reports/:reportId/resolve
POST /moderation/listings/:slug/block
POST /moderation/users/:username/block
POST /storage/uploads
GET /uploads/:fileName
```

Las rutas de Identity usan JWT local firmado con `JWT_ACCESS_SECRET` y `JWT_REFRESH_SECRET`. Estas variables pueden definirse en el `.env` local de la raiz o en el entorno del proceso; `.env.example` documenta los nombres sin incluir secretos reales.

Las rutas de Storage usan `STORAGE_DRIVER=local` durante desarrollo y `STORAGE_DRIVER=supabase` para produccion. La subida esta protegida por access token y limita imagenes a JPG, PNG, WebP o GIF de hasta 2 MB. En local, la lectura de `/uploads/:fileName` es publica para servir `uploads/`; en produccion, el adaptador de Supabase Storage devuelve la URL publica del bucket `wormarket-listing-images`.

`POST /listings` requiere cabecera `Authorization: Bearer <accessToken>`. `PATCH /listings/:slug` requiere token del vendedor propietario, mantiene el slug estable y permite modificar dimension, titulo, descripcion, precio, rareza e imagenes mientras el anuncio siga editable. Las rutas de lectura de Listings son publicas.

Las rutas de Favorites requieren cabecera `Authorization: Bearer <accessToken>`. `POST /favorites/:listingSlug` marca un anuncio como favorito de forma idempotente y `DELETE /favorites/:listingSlug` lo elimina de la lista del usuario autenticado.

Las rutas de Offers requieren cabecera `Authorization: Bearer <accessToken>`. `POST /offers` permite ofertar por anuncios publicados de otros usuarios, `GET /offers` lista las ofertas realizadas por el usuario autenticado y `GET /listings/:listingSlug/offers` permite al vendedor ver las ofertas recibidas. Las acciones `accept`, `reject` y `cancel` actualizan el estado de la oferta; aceptar una oferta reserva el anuncio y rechaza las demas ofertas pendientes.

Las rutas de Notifications requieren cabecera `Authorization: Bearer <accessToken>`. `GET /notifications` lista las notificaciones del usuario autenticado, `GET /notifications/unread-count` devuelve el total pendiente, `POST /notifications/:notificationId/read` marca una notificacion propia como leida y `POST /notifications/read-all` marca todas como leidas. El gateway Socket.IO local usa el namespace `/notifications` y los eventos `notifications:join` y `notification:new`.

Las rutas de Transactions requieren cabecera `Authorization: Bearer <accessToken>`. `POST /transactions/from-offer/:offerId` crea de forma idempotente una transaccion desde una oferta aceptada del vendedor autenticado, `GET /transactions` lista las transacciones donde participa el usuario autenticado, `GET /transactions/:transactionId` devuelve el detalle solo a comprador o vendedor y `POST /transactions/:transactionId/complete` completa la transaccion y marca el anuncio como vendido.

Las rutas de Conversations requieren cabecera `Authorization: Bearer <accessToken>`. `POST /conversations` crea de forma idempotente una conversacion entre comprador y vendedor a partir de un anuncio, `GET /conversations` lista las conversaciones del usuario autenticado, `GET /conversations/:conversationId/messages` devuelve mensajes solo a participantes, `POST /conversations/:conversationId/messages` envia mensajes y `POST /conversations/:conversationId/read` marca como leidos los mensajes recibidos. El gateway Socket.IO local usa el namespace `/conversations` y los eventos `conversation:join`, `message:send`, `message:sent`, `message:read`.

Para produccion inicial en Vercel, realtime no dependera de Socket.IO. La estrategia decidida es polling REST con TanStack Query para chat y notificaciones, usando `NEXT_PUBLIC_REALTIME_MODE=polling`. Supabase Realtime queda como mejora posterior si aporta valor a la demo.

Las rutas de Reviews permiten valorar transacciones completadas. `POST /reviews` requiere cabecera `Authorization: Bearer <accessToken>` y crea una valoracion del otro participante de la transaccion; cada participante solo puede valorar una vez la misma transaccion. `GET /users/:username/reviews` lista publicamente las valoraciones recibidas por un usuario. La reputacion publica se recalcula como media de estrellas en escala 0-100.

Las rutas de Moderation requieren access token. Cualquier usuario autenticado puede crear denuncias sobre anuncios o perfiles. Solo usuarios con rol `MODERATOR` o `ADMIN` pueden listar denuncias, resolverlas, bloquear anuncios y bloquear usuarios. Los anuncios bloqueados dejan de aparecer en lecturas publicas y los usuarios bloqueados no pueden publicar nuevos anuncios.


