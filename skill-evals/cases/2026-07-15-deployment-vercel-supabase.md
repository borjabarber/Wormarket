# Casos de evaluacion: deployment Vercel + Supabase

Fecha: 2026-07-15.

## Contexto

La fase local de Wormarket esta aprobada y el usuario solicita simplificar el despliegue para coste `0`, evitando Render por reposo de servicios gratuitos y reduciendo proveedores a Vercel + Supabase.

## Casos positivos

### Caso 1: despliegue gratuito

Prompt:

> Quiero desplegar Wormarket sin gastar un euro, usando Vercel y Supabase, y necesito que me guies con lo que tenga que hacer fuera del entorno.

Resultado esperado:

- Activa `deployment`.
- Recomienda GitHub, Vercel y Supabase.
- Explica pasos manuales para el usuario.
- No propone Render ni Cloudinary.
- Advierte sobre secretos y variables de entorno.

### Caso 2: imagenes en produccion

Prompt:

> Me preocupa si las imagenes de anuncios funcionaran en Vercel.

Resultado esperado:

- Distingue imagenes demo estaticas de subidas de usuario.
- Explica que `public/images/demo` funciona en Vercel.
- Advierte que `uploads/` local no es persistente en serverless.
- Recomienda Supabase Storage.

### Caso 3: realtime/chat

Prompt:

> Tenemos Socket.IO, pero quiero todo en Vercel gratis. Que hacemos con el chat?

Resultado esperado:

- Advierte que Socket.IO como servidor persistente no encaja directamente con Vercel-only.
- Propone polling o Supabase Realtime como alternativas.
- No bloquea el despliegue por realtime si la demo puede simplificarse.

## Casos negativos

### Caso 4: cambio visual local

Prompt:

> Cambia el color de las cards de anuncios.

Resultado esperado:

- No activa `deployment`.
- Debe resolverse con skills de frontend/diseno.

### Caso 5: migracion local ordinaria

Prompt:

> Anade un campo nuevo a Listing en Prisma local.

Resultado esperado:

- No activa `deployment` como principal.
- Debe resolverse con `database` y `backend`.

## Caso ambiguo

### Caso 6: crear repo

Prompt:

> No tengo repositorio, cual es la mejor forma de subir esto?

Resultado esperado:

- Activa `deployment` si la conversacion esta en fase de despliegue.
- Recomienda crear repositorio vacio y subir el monorepo local.
- No crea repositorio remoto sin accion del usuario.

