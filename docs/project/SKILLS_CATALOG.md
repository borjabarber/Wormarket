# Skills Catalog

Inventario auditado de skills disponibles para Wormarket.

Fecha de revision inicial: 2026-07-09.  
Ultima auditoria completa: 2026-07-14.  
Ultima revision puntual: 2026-07-15.

## Resumen ejecutivo

- Se inspeccionaron las 16 skills presentes en `skills/`.
- Se leyeron todos los `SKILL.md`.
- Se revisaron referencias auxiliares Markdown relevantes de accesibilidad, backend, Tailwind CSS, testing web y `skill-creator`.
- No se detecto una carencia reutilizable que obligue a crear una skill nueva en esta tarea.
- La fase activa es `Despliegue`.
- La skill `deployment` fue actualizada puntualmente para una estrategia gratuita GitHub + Vercel + Supabase.

## Skills oficiales de Wormarket

| Skill | Finalidad | Disparadores | No utilizar para | Estado 2026-07-14 | Ultima revision |
|---|---|---|---|---|---|
| `frontend` | Implementar paginas, componentes, formularios, hooks y clientes API en `apps/web` | Cambios en UI Next.js, copy visible, TanStack Query, formularios | Reglas de dominio backend, migraciones, despliegues | Valida y vigente; menciona Tailwind como tecnologia objetivo aunque el frontend actual usa CSS propio | 2026-07-14 |
| `backend` | Implementar modulos NestJS, controladores, casos de uso, DTOs, mappers y adaptadores | Cambios en `apps/api`, dominio backend, REST, auth, Socket.IO | Diseno visual o CSS | Valida y vigente; adaptada a monolito modular, Clean Architecture y NestJS | 2026-07-14 |
| `database` | Modelar Prisma, PostgreSQL local, migraciones, seed, indices y repositorios persistentes | Cambios en `schema.prisma`, migraciones, seed, consultas y Docker PostgreSQL | UI, despliegue cloud, logica visual | Valida y vigente; bloquea migraciones cloud durante fase local | 2026-07-14 |
| `testing` | Definir, implementar y ejecutar pruebas unitarias, integracion y e2e | Bugs, nuevas capacidades, refactors, componentes, controladores, flujos locales | Despliegue o diseno visual puro | Valida y vigente; encaja con Vitest, Supertest, RTL y smoke/e2e local | 2026-07-14 |
| `design-system` | Mantener tokens, componentes base, responsive, estados y consistencia visual | `docs/design`, componentes compartidos, navegacion, formularios, cards | Dominio, persistencia o despliegue | Valida; debe interpretarse junto a la direccion visual actual y CSS propio | 2026-07-14 |
| `security` | Revisar secretos, env, auth JWT, refresh tokens, CORS, permisos y subidas | Auth, roles, rutas protegidas, storage, validacion, CORS | Cambios visuales sin impacto de seguridad | Valida y vigente; ya se aplico en la revision de seguridad local | 2026-07-14 |
| `deployment` | Preparar despliegue gratuito en GitHub, Vercel y Supabase | Fase `Despliegue`, Vercel, Supabase PostgreSQL, Supabase Storage, variables, migraciones, repo GitHub, API serverless | Desarrollo local ordinario, Render/Cloudinary sin aprobacion, secretos en repo | Valida y actualizada para coste `0`; advierte riesgos de NestJS persistente y Socket.IO en Vercel-only | 2026-07-15 |

## Skills externas o de referencia

| Skill | Finalidad | Disparadores | No utilizar para | Estado 2026-07-14 | Procedencia | Ultima revision |
|---|---|---|---|---|---|---|
| `accessibility` | Auditar y mejorar accesibilidad web con WCAG 2.2 | A11y, teclado, lectores de pantalla, contraste, WCAG | Backend, persistencia o despliegue | Valida como referencia principal de accesibilidad; no especifica Wormarket pero sus patrones ya encajan | Externa | 2026-07-14 |
| `deploy-to-vercel` | Desplegar aplicaciones en Vercel | Peticiones explicitas de deploy o preview | Saltarse el plan Wormarket, configurar secretos sin revisar, ignorar Supabase | Util solo como referencia secundaria; prevalece `deployment` | Externa Vercel | 2026-07-15 |
| `frontend-design` | Dar direccion visual distintiva y evitar interfaces genericas | Redisenos, paginas visuales, identidad, copy UI | Backend, persistencia, pruebas puras | Valida como referencia creativa; no sustituye `design-system` ni requisitos de marketplace real | Externa | 2026-07-14 |
| `nodejs-backend-patterns` | Patrones backend Node.js con Express/Fastify, middleware, auth y bases de datos | Arquitectura Node.js generica, APIs, real-time | Implementar NestJS sin adaptacion, Redis/MongoDB/microservicios en MVP | Parcialmente aplicable; usar solo como referencia filtrada por `backend` | Externa | 2026-07-14 |
| `nodejs-best-practices` | Principios de decision Node.js, seguridad, async, testing y arquitectura | Decisiones Node.js generales o aclarar tradeoffs | Sustituir decisiones ya tomadas por Wormarket | Parcialmente aplicable; sus decisiones deben subordinarse a NestJS/Prisma/PostgreSQL local | Externa community | 2026-07-14 |
| `skill-creator` | Crear, mejorar y evaluar skills | Crear o mejorar una skill, optimizar descripcion, ejecutar evals | Tareas de producto ordinarias | Valida; adaptada con reglas especificas de Wormarket | Externa adaptada | 2026-07-14 |
| `tailwind-css-patterns` | Patrones Tailwind para layout, responsive, dark mode, componentes, accesibilidad y rendimiento | Tareas Tailwind o criterios CSS transferibles | Dominio backend o sustituir el sistema visual del proyecto | Valida como referencia; Wormarket no tiene Tailwind plenamente configurado, asi que se aplica de forma conceptual | Externa | 2026-07-14 |
| `typescript-advanced-types` | Tipos avanzados TypeScript, generics, unions, utilidades y type-safety | Tipado complejo, APIs type-safe, librerias o refactors de tipos | CRUD simple o documentacion ordinaria | Valida como referencia; usar con moderacion para evitar sobreingenieria | Externa | 2026-07-14 |
| `webapp-testing` | Testing de apps web locales con Playwright y scripts Python | Verificacion visual o funcional de UI local con navegador | Unit tests puros, deploy o entornos sin Python/Playwright | Valida como referencia, pero limitada localmente porque Python/Playwright no estan disponibles en PATH segun comprobaciones previas | Externa | 2026-07-14 |

## Recursos auxiliares revisados

- `skills/accessibility/references/A11Y-PATTERNS.md`
- `skills/accessibility/references/WCAG.md`
- `skills/nodejs-backend-patterns/references/advanced-patterns.md`
- `skills/skill-creator/references/schemas.md`
- `skills/tailwind-css-patterns/references/layout-patterns.md`
- `skills/tailwind-css-patterns/references/component-patterns.md`
- `skills/tailwind-css-patterns/references/responsive-design.md`
- `skills/tailwind-css-patterns/references/animations.md`
- `skills/tailwind-css-patterns/references/performance.md`
- `skills/tailwind-css-patterns/references/accessibility.md`
- `skills/tailwind-css-patterns/references/configuration.md`
- `skills/tailwind-css-patterns/references/reference.md`

No se leyeron scripts Python o shell completos salvo que fueran necesarios para la tarea. En esta auditoria basto con inventariarlos y revisar las instrucciones que los describen.

## Skills duplicadas o solapadas

- `accessibility` y `tailwind-css-patterns/references/accessibility.md` se solapan en foco, contraste, ARIA y reduced motion. Prevalece `accessibility`; Tailwind aporta patrones tecnicos cuando se trabaje con utilidades CSS.
- `frontend`, `design-system`, `frontend-design` y `tailwind-css-patterns` se solapan en UI. Prevalece `frontend` para implementacion, `design-system` para coherencia visual, `frontend-design` para direccion creativa y `tailwind-css-patterns` solo como referencia tecnica.
- `backend`, `nodejs-backend-patterns` y `nodejs-best-practices` se solapan en arquitectura Node.js. Prevalece `backend` porque esta adaptada a NestJS y Wormarket.
- `deployment` y `deploy-to-vercel` se solapan en Vercel. Prevalece `deployment` porque contempla GitHub, Supabase, Storage, variables, migraciones, restricciones de coste `0` y pasos manuales del usuario.

## Skills demasiado amplias

- `nodejs-backend-patterns`: incluye Express, Fastify, Redis, MongoDB, caching y microservicios. Debe filtrarse para no introducir tecnologias fuera del MVP.
- `nodejs-best-practices`: util como principios, pero demasiado general para modificar decisiones ya cerradas.
- `tailwind-css-patterns`: cubre muchas areas UI y Tailwind v4.1, pero Wormarket todavia no esta configurado como proyecto Tailwind completo.
- `skill-creator`: muy potente y orientada a subagentes/evals; usarla solo cuando exista una carencia real de skill.

## Skills demasiado especificas

- `deploy-to-vercel`: cubre solo Vercel y no el despliegue completo previsto de Wormarket con Supabase.
- `typescript-advanced-types`: especializada en tipos complejos; no debe activarse para cambios simples.

## Skills desactualizadas o con riesgo

- `SKILLS_CATALOG.md` estaba desactualizado al 2026-07-09 antes de esta auditoria.
- `webapp-testing` depende de Python y Playwright; en tareas previas se comprobo que Python no estaba disponible en PATH y Playwright no estaba instalado.
- `tailwind-css-patterns` presupone Tailwind v4.1; el frontend actual usa CSS propio y Next.js, por lo que sus ejemplos no deben copiarse literalmente sin configurar Tailwind.
- `deploy-to-vercel` contiene flujos especificos de Vercel que pueden saltarse la preparacion de Supabase si se aplican literalmente.
- `nodejs-backend-patterns` contiene ejemplos con Redis/MongoDB/microservicios que AGENTS.md desaconseja para el MVP.

## Skills incompletas

No hay skills oficiales vacias. Las oficiales son deliberadamente concisas y han funcionado para las tareas locales.

Limitaciones detectadas:

- `frontend` y `design-system` mencionan Tailwind como tecnologia objetivo, pero el estado real del frontend usa CSS propio; no es bloqueo, pero conviene revisar esta coherencia si se configura Tailwind o si se decide no incorporarlo.
- No existe una skill local especifica de documentacion tecnica.
- No existe una skill local especifica de coherencia de producto/dominio Wormarket.

## Carencias detectadas

- **Documentacion tecnica**: puede ser util crear una skill reutilizable si las tareas de documentacion empiezan a repetirse o requieren un flujo especializado. Por ahora no se crea porque `AGENTS.md`, `MASTER_PROMPT.md` y los documentos de proyecto cubren el proceso.
- **Producto/dominio Wormarket**: puede ser util una skill futura para mantener tono, objetos imposibles, reglas de marketplace y coherencia del universo. Por ahora no se crea porque la necesidad esta cubierta por `MASTER_PROMPT.md`, `MVP.md`, arquitectura y diseno.
- **Testing visual real**: `webapp-testing` podria ser suficiente si se instala Playwright/Python, pero hoy no es ejecutable tal cual en el entorno local.

Estas carencias no exigen aplicar `skill-creator` en esta tarea porque no bloquean la auditoria, no son mejoras sustanciales urgentes y existe una tarea posterior especifica para actualizar evaluaciones.

## Correspondencia por tipo de tarea

| Tipo de tarea | Skill principal | Skills auxiliares |
|---|---|---|
| UI Next.js | `frontend` | `design-system`, `accessibility`, `frontend-design`, `tailwind-css-patterns` |
| Componentes visuales | `design-system` | `frontend`, `accessibility`, `frontend-design` |
| Pulido visual de marketplace | `frontend-design` | `design-system`, `frontend`, `accessibility` |
| API NestJS | `backend` | `security`, `testing`, `nodejs-best-practices` |
| Prisma/PostgreSQL | `database` | `backend`, `testing`, `security` |
| Auth, permisos y storage seguro | `security` | `backend`, `frontend`, `testing` |
| Pruebas unitarias/integracion/e2e | `testing` | `frontend`, `backend`, `database`, `security`, `webapp-testing` |
| Accesibilidad | `accessibility` | `frontend`, `design-system`, `tailwind-css-patterns` |
| Rendimiento frontend/CSS | `frontend` | `tailwind-css-patterns`, `testing` |
| Tipado avanzado | `typescript-advanced-types` | `frontend`, `backend`, `testing` |
| Despliegue futuro | `deployment` | `deploy-to-vercel`, `security`, `database` |
| Crear o mejorar skills | `skill-creator` | Skills existentes relacionadas |

## Evaluaciones

Las evaluaciones documentadas estan en:

- `skill-evals/cases/initial-skills.md`
- `skill-evals/results/2026-07-09-initial-skills.md`
- `skill-evals/cases/2026-07-14-skills-refresh.md`
- `skill-evals/results/2026-07-14-skills-refresh.md`
- `skill-evals/cases/2026-07-15-deployment-vercel-supabase.md`
- `skill-evals/results/2026-07-15-deployment-vercel-supabase.md`

La evaluacion actualizada de 2026-07-14 es documental y cualitativa. No ejecuta subagentes, benchmarks ni visor de evaluacion, y no inventa metricas cuantitativas.

La evaluacion puntual de `deployment` de 2026-07-15 tambien es documental y cualitativa. Se centra en coste `0`, retirada de Render/Cloudinary, Supabase Storage, repositorio GitHub, realtime y pasos manuales del usuario.

Casos cubiertos:

- `frontend`, `backend`, `database`, `testing`, `security`, `design-system`, `deployment` y skills externas relevantes.
- Situaciones de solapamiento entre `frontend`, `design-system`, `frontend-design`, `accessibility` y `testing`.
- Solapamiento backend entre `backend`, `database`, `security`, `testing`, `nodejs-backend-patterns` y `nodejs-best-practices`.
- Bloqueo correcto de `deployment` y `deploy-to-vercel` en fase local.
- Limitacion actual de `webapp-testing` sin Python/Playwright disponibles.
