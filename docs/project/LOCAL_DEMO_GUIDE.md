# Guia de demo local

Esta guia resume como levantar Wormarket en local y probar el flujo principal del marketplace antes de validar la fase local.

## Requisitos

- Node.js compatible con el monorepo.
- npm.
- Docker Desktop abierto.
- Puertos libres:
  - Frontend: `3000`.
  - Backend: `3001`.
  - PostgreSQL: `5432`.

## Preparacion

Desde la raiz del repositorio:

```bash
npm install
docker compose up -d
npm run db:migrate
npm run db:seed
```

Si necesitas regenerar tokens locales, crea un `.env` local a partir de `.env.example` y define valores propios para:

```env
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
```

No uses secretos reales ni subas `.env` al repositorio.

## Arranque

```bash
npm run dev
```

URLs locales:

- Web: `http://localhost:3000`
- API: `http://localhost:3001`
- Salud API: `http://localhost:3001/health`

## Usuarios demo

La lista completa esta en `docs/project/DEMO_USERS.md`.

Contrasena comun:

```text
WormarketDemo123!
```

Usuarios utiles para demo:

| Uso | Email |
|---|---|
| Vendedor | `vendedor@demo.wormarket.local` |
| Comprador | `comprador@demo.wormarket.local` |
| Segundo comprador | `comprador2@demo.wormarket.local` |
| Moderador | `moderador@demo.wormarket.local` |
| Admin | `zerodev@demo.wormarket.local` |
| General | `braismoure@demo.wormarket.local` |

## Ruta recomendada de prueba

1. Abrir `http://localhost:3000`.
2. Explorar anuncios desde la home.
3. Buscar un objeto por texto, por ejemplo `botella`.
4. Iniciar sesion en `/auth` con un comprador.
5. Guardar un favorito desde el explorador o detalle.
6. Abrir un anuncio ajeno y enviar una oferta.
7. Iniciar sesion como vendedor y aceptar la oferta desde el detalle.
8. Abrir o continuar la conversacion.
9. Completar la transaccion desde `/transactions`.
10. Valorar al otro participante.
11. Revisar notificaciones en `/notifications`.
12. Iniciar sesion como moderador o admin y revisar `/moderation`.

## Comprobaciones locales

Comprobaciones rapidas:

```bash
npm run format
npm run lint
npm run typecheck
npm run test
```

Comprobacion de integracion con servidores ya levantados:

```bash
npm run test:integration:local
```

Flujo e2e local:

```bash
npm run test:e2e
```

El e2e necesita PostgreSQL, migraciones, seed, API y frontend en ejecucion.

## Limites de fase local

- No se despliega en Vercel, Render, Supabase ni Cloudinary.
- Las imagenes demo versionadas viven en `apps/web/public/images/demo/`.
- Las subidas locales van a `uploads/`, ignorado por Git.
- Los tokens se guardan en `sessionStorage` durante la fase local.
- El cierre de fase local se hara en la tarea `Validar flujo completo local`.
