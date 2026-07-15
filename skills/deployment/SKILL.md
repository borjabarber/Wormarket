---
name: deployment
description: Prepara, revisa y ejecuta el despliegue gratuito de Wormarket con GitHub, Vercel y Supabase. Usa esta skill en la fase Despliegue, cuando el usuario quiera publicar la app sin coste, revisar el plan de produccion, configurar repositorio, Vercel, Supabase PostgreSQL, Supabase Storage, variables de entorno, migraciones, seed demo, health checks o adaptar NestJS/Next.js a una arquitectura serverless. No uses Render ni Cloudinary salvo aprobacion explicita posterior.
---

# Objetivo

Guiar el despliegue de Wormarket con una estrategia gratuita, simple y documentada:

```text
GitHub -> Vercel -> Next.js + API serverless
                 -> Supabase PostgreSQL
                 -> Supabase Storage
```

La prioridad es que el usuario pueda presentar el TFM sin gastar dinero, sin depender de servidores gratuitos que entren en reposo y sin multiplicar cuentas o proveedores.

# Cuando utilizarla

- La fase activa es `Despliegue`.
- El usuario pide publicar, preparar o revisar el despliegue.
- Hay que crear o conectar repositorio GitHub.
- Hay que configurar Vercel, Supabase, variables de entorno, migraciones, seed o health checks.
- Hay que adaptar almacenamiento de imagenes a Supabase Storage.
- Hay que decidir como resolver realtime/chat en Vercel.

# Cuando no utilizarla

- Desarrollo local ordinario.
- Cambios de UI o backend que no afecten al despliegue.
- Despliegues en Render, Railway, Fly.io, Cloudinary u otros proveedores no aprobados para esta fase.
- Guardar secretos en el repositorio.
- Ejecutar migraciones o seeds de produccion sin confirmacion explicita del usuario.

# Principios

- Mantener coste inicial en `0`.
- Reducir proveedores: GitHub, Vercel y Supabase.
- Preferir configuracion manual guiada para cuentas, tokens y paneles externos.
- Documentar cada decision y cada variable, sin incluir secretos reales.
- Separar local, preview y produccion.
- No asumir que el usuario conoce despliegues: explicar cada accion externa con pasos concretos.
- Validar localmente antes de desplegar y validar la URL publica despues.

# Arquitectura objetivo

```text
Usuario
  |
  v
Vercel
  |- Next.js frontend
  |- API serverless / endpoints adaptados
  |
  v
Supabase
  |- PostgreSQL
  |- Storage para imagenes
  |- Opcional: Realtime para eventos si se decide usarlo
```

El backend NestJS actual no debe asumirse desplegable sin cambios en Vercel como servidor persistente. Antes de publicar, revisa si conviene:

- adaptar endpoints a funciones/rutas serverless,
- mantener una capa API minima dentro de Next.js,
- o simplificar realtime mediante polling o Supabase Realtime.

# Flujo recomendado

1. Revisar plan gratuito Vercel + Supabase y limites vigentes.
2. Crear repositorio GitHub vacio y subir el monorepo local.
3. Preparar `.env.example` y documentacion de variables.
4. Crear proyecto Supabase.
5. Configurar PostgreSQL Supabase.
6. Ejecutar migraciones Prisma de forma controlada.
7. Implementar o adaptar Supabase Storage para imagenes.
8. Decidir estrategia realtime compatible con Vercel.
9. Preparar la API para Vercel/serverless.
10. Conectar Vercel al repositorio.
11. Configurar variables de entorno en Vercel.
12. Desplegar y revisar logs.
13. Cargar seed demo controlado.
14. Probar flujo completo en URL publica.
15. Documentar despliegue y preparar demo TFM.

# Tareas que requieren accion del usuario

Pide al usuario que las haga fuera del entorno cuando toque:

- Crear cuenta o iniciar sesion en GitHub, Vercel o Supabase.
- Crear repositorio GitHub.
- Crear proyecto Supabase.
- Copiar cadenas de conexion o claves desde paneles externos.
- Pegar variables de entorno en Vercel.
- Autorizar Vercel para acceder al repositorio GitHub.

Da pasos concretos y espera confirmacion antes de continuar si la siguiente accion depende de esos paneles.

# Variables esperadas

No inventes valores reales. Documenta nombres y pide al usuario copiar secretos desde el panel correspondiente.

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

Las claves `SUPABASE_SERVICE_ROLE_KEY`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `DATABASE_URL` y `DIRECT_URL` son secretas y no deben subirse al repositorio.

# Realtime

Socket.IO en servidor persistente no encaja de forma directa con una arquitectura Vercel-only. Antes de desplegar, decide y documenta una de estas opciones:

- `polling`: mas simple para demo TFM; consultas periodicas para chat/notificaciones.
- `supabase-realtime`: mas realista, pero requiere adaptar eventos y seguridad.
- `sin realtime productivo`: mantener REST para demo si el tiempo manda.

No mantengas Socket.IO como requisito de produccion si bloquea el despliegue gratuito.

# Comprobaciones

Antes de desplegar:

- `npm run format`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- revisar `.env.example`
- comprobar que no hay secretos versionados

Despues de desplegar:

- abrir la URL publica de Vercel,
- comprobar health check,
- iniciar sesion con usuario demo,
- explorar anuncios,
- publicar o simular publicacion,
- probar favoritos/ofertas/chat segun la estrategia realtime elegida,
- revisar logs de Vercel,
- confirmar que Supabase tiene datos demo esperados.

# Resultado esperado

Un despliegue gratuito, reproducible y documentado de Wormarket en Vercel + Supabase, con una lista clara de pasos manuales para el usuario y sin dependencias en Render o Cloudinary.
