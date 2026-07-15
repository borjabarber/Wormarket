# Roadmap

## Estado actual

Version actual: `0.27.25`.

Fase activa: Despliegue.

La fase local esta completada y aprobada: funcionalidades principales, seed visual, pruebas, revisiones de calidad, auditoria de skills, changelog, versionado, README academico y validacion completa local quedan cerrados. La fase activa pasa a despliegue, sin servicios cloud configurados todavia.

## Hitos completados

- Preparacion documental y nombre oficial Wormarket.
- Monorepo con npm workspaces.
- Frontend Next.js y backend NestJS.
- TypeScript estricto, ESLint, Prettier, Vitest, Supertest y CI inicial.
- PostgreSQL local con Docker, Prisma, migraciones y seed.
- Modulos backend: Dimensions, Users, Identity, Listings, Favorites, Offers, Transactions, Conversations, Reviews, Notifications, Moderation y Storage.
- Pantallas frontend: home/explorador, autenticacion, detalle, creacion, edicion, favoritos, ofertas, chat, perfil, transacciones, valoraciones, notificaciones y moderacion.
- Seed visual con 13 anuncios y 6 usuarios demo.
- Revisiones de responsive, accesibilidad, seguridad y rendimiento.
- Pruebas unitarias, integracion y e2e local.
- Auditoria y evaluacion actualizada de skills.
- Revision de changelog y versionado.

## Pendiente inmediato

- Subir monorepo local a GitHub.

## Fase de despliegue

La fase de despliegue queda activa tras aprobar la fase local. El roadmap previsto prioriza coste `0` y evita Render/Cloudinary salvo decision posterior:

- Crear repositorio GitHub y subir el monorepo.
- Crear proyecto Supabase.
- Configurar PostgreSQL Supabase.
- Ejecutar migraciones Prisma.
- Adaptar imagenes a Supabase Storage.
- Revisar realtime para Vercel, con polling o Supabase Realtime si encaja.
- Preparar API para Vercel/serverless.
- Desplegar Wormarket en Vercel.
- Configurar variables, CORS, cookies seguras y health checks.
- Cargar datos demo controlados.
- Probar flujo completo en URL publica.
- Documentar despliegue.

## 1.0.0

Reservada para el cierre estable del MVP local o para una version de produccion aprobada explicitamente. No se crearan tags ni releases sin permiso.
