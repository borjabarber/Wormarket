# Roadmap

## Estado actual

Version actual: `0.27.44`.

Fase activa: Despliegue.

La fase local esta completada y aprobada: funcionalidades principales, seed visual, pruebas, revisiones de calidad, auditoria de skills, changelog, versionado, README academico y validacion completa local quedan cerrados. La fase activa pasa a despliegue con GitHub, Supabase PostgreSQL, Supabase Storage, API serverless, proyecto Vercel conectado, variables de entorno configuradas y despliegue publico operativo.

## Hitos completados

- Preparacion documental y nombre oficial Wormarket.
- Monorepo con npm workspaces.
- Frontend Next.js y backend NestJS.
- TypeScript estricto, ESLint, Prettier, Vitest, Supertest y CI final gratuita.
- PostgreSQL local con Docker, Prisma, migraciones y seed.
- Modulos backend: Dimensions, Users, Identity, Listings, Favorites, Offers, Transactions, Conversations, Reviews, Notifications, Moderation y Storage.
- Pantallas frontend: home/explorador, autenticacion, detalle, creacion, edicion, favoritos, ofertas, chat, perfil, transacciones, valoraciones, notificaciones y moderacion.
- Seed visual con 13 anuncios y 6 usuarios demo.
- Revisiones de responsive, accesibilidad, seguridad y rendimiento.
- Pruebas unitarias, integracion y e2e local.
- Auditoria y evaluacion actualizada de skills.
- Revision de changelog y versionado.
- Supabase PostgreSQL migrado, Supabase Storage adaptado para imagenes de anuncios, API preparada para Vercel/serverless, repositorio GitHub conectado/importado en Vercel con raiz `./`, variables de entorno configuradas, URL publica desplegada, seed demo cargado en Supabase, CI final gratuita validada y flujo e2e publico completado.

## Pendiente inmediato

- Documentar despliegue.

## Fase de despliegue

La fase de despliegue queda activa tras aprobar la fase local. El roadmap previsto prioriza coste `0` y evita Render/Cloudinary salvo decision posterior:

- Crear repositorio GitHub y subir el monorepo.
- Crear proyecto Supabase.
- Configurar PostgreSQL Supabase.
- Ejecutar migraciones Prisma.
- Adaptar imagenes a Supabase Storage. Completado a nivel de codigo y documentacion.
- Realtime de produccion inicial decidido como polling REST; Supabase Realtime queda como mejora posterior.
- Preparar API para Vercel/serverless. Completado: `api/[...path].ts` expone NestJS bajo `/api`.
- Conectar Vercel al repositorio GitHub. Completado: repo `borjabarber/Wormarket`, raiz `./`, build `npm run build:web`, output `apps/web/.next`.
- Configurar variables de entorno en Vercel. Completado: variables importadas desde `.env.vercel.local` local ignorado por Git, sin registrar secretos.
- Desplegar Wormarket en Vercel. Completado: frontend publico carga y `GET /api/health` responde 200.
- Cargar datos demo controlados. Completado: Supabase contiene los usuarios demo, dimensiones, anuncios y datos relacionados del seed idempotente.
- Configurar GitHub Actions final. Completado: CI gratuita con PostgreSQL local, migraciones, seed, calidad, tests, build y audit.
- Configurar health checks. Completado: liveness, readiness con PostgreSQL y script `health:public`.
- Probar flujo completo en URL publica. Completado con `npm run test:e2e:public`.
- Documentar despliegue.

## 1.0.0

Reservada para el cierre estable del MVP local o para una version de produccion aprobada explicitamente. No se crearan tags ni releases sin permiso.
