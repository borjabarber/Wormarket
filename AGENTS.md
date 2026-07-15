# AGENTS.md

## Proyecto

El nombre oficial del proyecto es **Wormarket**.

Wormarket es un marketplace interdimensional de objetos imposibles. Debe funcionar como una plataforma real de compraventa, aunque su universo sea fantastico.

## Objetivo academico

El proyecto debe demostrar arquitectura de software, Clean Architecture, DDD ligero, monolito modular, frontend, backend, APIs REST, PostgreSQL, autenticacion, autorizacion, tiempo real, validacion, testing, seguridad, contenedores, CI, despliegue posterior, accesibilidad, documentacion tecnica y gestion de tareas mediante agentes.

Evita la sobreingenieria. No uses microservicios, Kubernetes, Kafka, RabbitMQ ni Event Sourcing completo durante el MVP.

## Fase activa

Fase activa: Despliegue.

La fase local esta completada y aprobada. Durante despliegue, configura servicios externos de forma incremental, documentada y sin guardar secretos en el repositorio.

## Arquitectura

- Monorepo con npm workspaces.
- Frontend en `apps/web`.
- Backend en `apps/api`.
- Paquetes compartidos en `packages/`.
- Monolito modular.
- Clean Architecture.
- DDD ligero.
- CQRS ligero solo como organizacion de casos de uso.
- Eventos de dominio internos cuando aporten claridad.

## Tecnologias

Frontend: Next.js, React, TypeScript, Tailwind CSS, TanStack Query, React Hook Form, Zod y Socket.IO Client.

Backend: NestJS, TypeScript, Prisma, PostgreSQL, Socket.IO, JWT y Swagger/OpenAPI.

Calidad: npm workspaces, ESLint, Prettier, Jest o Vitest, React Testing Library, Supertest, Docker, Docker Compose y GitHub Actions.

Produccion prevista para la fase de despliegue: Vercel, Supabase PostgreSQL y Supabase Storage. No uses Render ni Cloudinary salvo aprobacion explicita posterior.

## Convenciones

- Interfaz visible en espanol.
- Codigo fuente, identificadores, rutas internas y commits en ingles.
- Mensajes visibles al usuario en espanol.
- Codigos internos de error en ingles.
- TypeScript estricto.
- Variables de entorno para configuracion.
- Sin secretos en el repositorio.
- Sin URLs fijas de produccion.
- Rutas y servicios externos desacoplados mediante adaptadores.

## Comandos previstos

Cuando el monorepo exista, la raiz debe exponer:

```bash
npm run dev
npm run dev:web
npm run dev:api
npm run build
npm run build:web
npm run build:api
npm run lint
npm run format
npm run typecheck
npm run test
npm run test:unit
npm run test:e2e
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:reset
```

No inventes que un comando pasa si no se ha ejecutado.

## Flujo obligatorio

1. Lee este archivo.
2. Lee `docs/project/MASTER_PROMPT.md`.
3. Lee `docs/project/TASKS.md`.
4. Comprueba la fase activa.
5. Lee `WORK_LOG.md`, `CHANGELOG.md` y `VERSIONING.md` si existen.
6. Inspecciona `skills/`.
7. Lee el `SKILL.md` de las skills aplicables.
8. Usa `skills/skill-creator/SKILL.md` si una skill falta o necesita una mejora sustancial.
9. Trabaja solo en la primera tarea pendiente de la fase activa.
10. Implementa, prueba y documenta.
11. Actualiza `WORK_LOG.md`.
12. Actualiza `CHANGELOG.md` si hay cambios relevantes.
13. Actualiza la version solo si corresponde.
14. No avances a la siguiente tarea.

## Reglas de skills

Antes de cada tarea:

- Lista todas las skills disponibles.
- Lee nombres y descripciones.
- Identifica candidatas.
- Lee integramente las aplicables.
- Revisa auxiliares necesarios.
- Comprueba conflictos con la arquitectura y la fase activa.
- Registra skills revisadas y aplicadas en `WORK_LOG.md`.

No asumas el contenido de una skill por su nombre.

## Crear o mejorar skills

Usa `skills/skill-creator/SKILL.md` cuando falte una skill reutilizable o una existente sea insuficiente. El proceso debe incluir:

- Captura de intencion.
- Redaccion inicial.
- Casos positivos, negativos y ambiguos.
- Evaluacion con y sin skill cuando sea viable.
- Revision cualitativa.
- Metricas solo si se han obtenido.
- Mejora de la descripcion.
- Iteracion.
- Ampliacion progresiva de pruebas.

## Testing

La cobertura debe escalar con el riesgo. Prioriza comportamiento observable.

- Unitarias para dominio, value objects, casos de uso y servicios.
- Integracion para repositorios, Prisma, controladores, autenticacion y adaptadores.
- E2E para flujos principales cuando existan frontend y backend.

## Seguridad

- No guardes secretos en codigo.
- No subas `.env`.
- Valida entrada en frontend y backend.
- Usa contrasenas cifradas.
- Protege rutas privadas.
- Aplica autorizacion por propietario y roles.
- Configura CORS por entorno.
- No expongas trazas internas.

## Diseno y accesibilidad

- Diseno responsive desde el inicio.
- HTML semantico.
- Navegacion por teclado.
- Foco visible.
- Contraste suficiente.
- Formularios con labels y errores asociados.
- Textos alternativos.
- Respeto a `prefers-reduced-motion`.

## Logs, changelog y versionado

- `docs/project/WORK_LOG.md` registra trabajo operativo real.
- `docs/project/CHANGELOG.md` registra cambios relevantes.
- `docs/project/VERSIONING.md` define cuando cambiar version.
- No crees tags ni releases sin permiso explicito.

## Definition of Done

Una tarea solo se completa cuando:

- Cumple los requisitos.
- Respeta arquitectura y dominio.
- Compila y pasa las comprobaciones relevantes disponibles.
- Esta documentada.
- No adelanta despliegue.
- No introduce secretos.
- Las skills fueron revisadas y aplicadas si correspondia.
- `WORK_LOG.md` esta actualizado.
- `CHANGELOG.md` esta actualizado si correspondia.
- La version se actualizo solo si correspondia.

## Prioridad de instrucciones

1. Instrucciones del sistema y del entorno.
2. Instrucciones del usuario.
3. `AGENTS.md`.
4. `docs/project/MASTER_PROMPT.md`.
5. `docs/project/TASKS.md`.
6. Skills aplicables.
7. Resto de documentacion.

Si hay conflicto, documentalo antes de modificar codigo.

## Resumen final

El resumen final debe indicar tarea realizada, archivos creados, archivos modificados, skills revisadas, skills aplicadas, skills descartadas, evaluaciones, comprobaciones, documentacion, registro, version, limitaciones, estado de la tarea y siguiente tarea recomendada.
