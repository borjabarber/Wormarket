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
  |- API serverless o endpoints adaptados
  |
  v
Supabase
  |- PostgreSQL
  |- Storage para imagenes
  |- Realtime opcional si se decide sustituir Socket.IO
```

## Riesgo tecnico principal

El backend actual es NestJS como servidor persistente. Vercel funciona principalmente con arquitectura serverless, por lo que no se debe asumir que `apps/api` se despliega sin cambios como si fuera Render.

Antes de publicar hay que decidir una estrategia:

- adaptar endpoints a Vercel/serverless,
- mover una capa API minima a Next.js,
- o mantener solo lo necesario para la demo publica.

Socket.IO tambien requiere revision. Para coste `0` y menor complejidad, la opcion preferida inicial es simplificar realtime mediante polling o estudiar Supabase Realtime si el tiempo lo permite.

## Repositorio GitHub

Repositorio creado:

```text
https://github.com/borjabarber/Wormarket.git
```

El repositorio remoto responde y ya contiene el monorepo local en la rama `main`.

Commits iniciales:

- `6fd3bba`: monorepo inicial de Wormarket.

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

- `DIRECT_URL` queda reservado para el flujo Supabase/Prisma y se cableara si la configuracion de PostgreSQL lo requiere.
- `STORAGE_DRIVER=supabase` queda preparado, pero el adaptador Supabase Storage se implementara en una tarea posterior.

## Tareas externas del usuario

El usuario tendra que hacer manualmente:

- Crear o iniciar sesion en GitHub.
- Crear el repositorio vacio.
- Crear o iniciar sesion en Vercel.
- Autorizar Vercel para leer el repositorio.
- Crear o iniciar sesion en Supabase.
- Crear el proyecto Supabase.
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
7. Adaptar Supabase Storage.
8. Revisar estrategia realtime.
9. Preparar API para Vercel.
10. Conectar Vercel al repositorio.
11. Configurar variables de entorno.
12. Desplegar.
13. Cargar seed demo controlado.
14. Probar flujo completo en URL publica.
15. Documentar despliegue.

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
- Comprobar health check.
- Iniciar sesion con usuario demo.
- Explorar anuncios.
- Probar detalle, favoritos y ofertas.
- Probar publicacion si Storage ya esta adaptado.
- Revisar logs de Vercel.
- Confirmar datos demo en Supabase.

## Coste previsto

Coste inicial esperado: `0 euros`.

No se configura dominio personalizado de pago. No se contratan planes Pro. Si algun panel solicita tarjeta o activar pago, se debe parar y revisar antes de continuar.
