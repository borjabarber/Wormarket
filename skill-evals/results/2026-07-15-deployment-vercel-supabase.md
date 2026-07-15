# Resultado de evaluacion: deployment Vercel + Supabase

Fecha: 2026-07-15.

Tipo de evaluacion: documental y cualitativa. No se ejecutaron subagentes ni benchmarks cuantitativos porque la mejora consistio en alinear una skill corta y el plan de proyecto con una decision de despliegue ya tomada con el usuario.

## Skill evaluada

- `skills/deployment/SKILL.md`

## Resultado por casos

### Caso 1: despliegue gratuito

Resultado: pasa.

Evidencia:

- La descripcion de la skill dispara con despliegue gratuito, GitHub, Vercel y Supabase.
- El objetivo explicita coste `0` y retirada de Render/Cloudinary salvo aprobacion posterior.
- El flujo incluye pasos manuales para cuentas, repositorio, Vercel y Supabase.

### Caso 2: imagenes en produccion

Resultado: pasa.

Evidencia:

- La skill incluye Supabase Storage como parte de la arquitectura objetivo.
- Las variables esperadas incluyen `STORAGE_DRIVER=supabase`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` y `SUPABASE_STORAGE_BUCKET`.
- El plan de despliegue distingue Storage y advierte que no se deben guardar secretos.

### Caso 3: realtime/chat

Resultado: pasa.

Evidencia:

- La skill documenta que Socket.IO como servidor persistente no encaja directamente con una arquitectura Vercel-only.
- Propone polling, Supabase Realtime o reducir realtime productivo si bloquea la demo.

### Caso 4: cambio visual local

Resultado: pasa.

Evidencia:

- La seccion `Cuando no utilizarla` excluye cambios de UI o backend que no afecten al despliegue.

### Caso 5: migracion local ordinaria

Resultado: pasa.

Evidencia:

- La skill esta enfocada a fase `Despliegue`, variables, migraciones de produccion y proveedores externos; las migraciones locales ordinarias siguen correspondiendo a `database`.

### Caso 6: crear repo

Resultado: pasa.

Evidencia:

- El flujo recomendado empieza por crear repositorio GitHub vacio y subir el monorepo local.
- La seccion de tareas externas indica que el usuario debe crear o iniciar sesion en GitHub y crear el repositorio.

## Revision cualitativa

La skill anterior seguia alineada con Render y Cloudinary. La version nueva reduce proveedores, encaja con la preocupacion del usuario sobre costes y reposo de Render, y advierte de forma explicita sobre los dos riesgos principales: backend NestJS persistente en Vercel y Socket.IO/realtime.

## Iteracion

No se requiere una segunda iteracion inmediata. La proxima revision deberia hacerse tras decidir la estrategia tecnica exacta para API serverless y realtime.

