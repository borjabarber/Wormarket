# Evaluacion actualizada de skills

Fecha: 2026-07-14.

## Tipo de evaluacion

Documental y cualitativa.

Se compararon los `SKILL.md` actuales, el catalogo auditado, la fase activa y los casos en `skill-evals/cases/2026-07-14-skills-refresh.md`.

No se ejecutaron subagentes, scripts externos, benchmarks, visor de evaluacion ni pruebas automatizadas de triggering. No se obtuvieron metricas cuantitativas.

## Resultado global

Las skills existentes siguen siendo suficientes para cerrar la fase local. No se detecta una necesidad obligatoria de crear una skill nueva antes de continuar.

La mejora principal necesaria no es cambiar skills, sino mantener evaluaciones mas realistas que cubran:

- Solapamiento entre frontend, diseno, accesibilidad y testing.
- Solapamiento entre backend, seguridad, base de datos y testing.
- Bloqueo de despliegue durante fase local.
- Uso limitado de skills externas con tecnologias no adoptadas por el MVP.
- Limitacion actual de testing visual con Playwright/Python.

## Resultado por skill

| Skill | Resultado 2026-07-14 | Observaciones |
|---|---|---|
| `frontend` | Apta | Dispara correctamente para `apps/web`, UI visible, formularios, TanStack Query y cliente API. Debe combinarse con `design-system`, `accessibility` y `testing` en cambios visuales reales. |
| `backend` | Apta | Dispara correctamente para NestJS, casos de uso, controladores, DTOs, auth, Socket.IO y adaptadores. Prevalece sobre referencias Node genericas. |
| `database` | Apta | Dispara correctamente para Prisma, migraciones, seed, indices, consultas y persistencia local. Mantiene bloqueo cloud. |
| `testing` | Apta | Dispara correctamente para bugs, nuevas capacidades, unitarias, integracion y e2e. Tambien cubre evaluaciones de skills aunque la propia skill diga que documentacion ordinaria no siempre la necesita. |
| `design-system` | Apta con matiz | Encaja con tokens, componentes, responsive y estados. Debe interpretarse con CSS propio actual aunque mencione Tailwind como tecnologia objetivo. |
| `security` | Apta | Cubre secretos, CORS, JWT, refresh tokens, permisos, storage y errores seguros. Debe activarse junto a backend/frontend cuando el flujo toque auth o datos sensibles. |
| `deployment` | Apta bloqueada | Correcta para readiness o fase futura. Durante desarrollo local no debe ejecutar servicios cloud ni migraciones remotas. |
| `accessibility` | Apta como referencia | Buena cobertura WCAG 2.2. Debe subordinar mensajes visibles al espanol del proyecto. |
| `deploy-to-vercel` | Bloqueada | Valida tecnicamente para Vercel, pero no aplicable durante fase local. En conflicto directo si se ejecuta ahora. |
| `frontend-design` | Apta como referencia creativa | Util para pulido visual y evitar UI generica. Debe equilibrarse con marketplace real y `design-system`. |
| `nodejs-backend-patterns` | Parcial | Aporta patrones Node, pero muchos ejemplos son Express/Fastify, Redis, MongoDB o microservicios. Usar solo filtrado por `backend`. |
| `nodejs-best-practices` | Parcial | Util para decisiones y tradeoffs, no para reemplazar NestJS/Prisma/PostgreSQL ya decididos. |
| `skill-creator` | Apta | Su adaptacion de Wormarket cubre creacion, mejora y evaluacion de skills. No exige cambios en esta tarea. |
| `tailwind-css-patterns` | Parcial | Buena referencia de responsive, dark mode, rendimiento y accesibilidad CSS, pero Wormarket usa CSS propio y no debe copiar utilidades Tailwind sin configuracion. |
| `typescript-advanced-types` | Apta con moderacion | Util para tipos complejos y clientes type-safe. Debe evitar sobreingenieria en CRUD simple o documentacion. |
| `webapp-testing` | Apta limitada | Correcta para Playwright local, pero depende de Python/Playwright. Si no estan disponibles, hay que declarar limitacion y usar otra verificacion. |

## Evaluacion de disparadores

| Area | Resultado | Riesgo residual |
|---|---|---|
| Frontend visible | Correcto | Activar demasiadas skills visuales si el cambio es minimo. |
| Backend/API | Correcto | Referencias externas Node pueden sugerir tecnologias fuera del MVP. |
| Base de datos | Correcto | No debe ejecutar migraciones cloud en fase local. |
| Seguridad | Correcto | Puede solaparse con backend/frontend; conviene registrar ambas cuando aplique. |
| Diseno visual | Correcto | `frontend-design` puede empujar estetica mas alla de claridad de marketplace si no se equilibra. |
| Accesibilidad | Correcto | Debe traducir ejemplos ingleses a interfaz visible en espanol. |
| Despliegue | Correcto bloqueado | `deploy-to-vercel` tiene instrucciones operativas que deben permanecer inactivas hasta fase 2. |
| Testing visual | Correcto limitado | Playwright/Python no estan garantizados en el entorno actual. |

## Evaluacion con y sin skill

No se ejecutaron agentes comparativos. La evaluacion con/sin skill se realizo de forma cualitativa:

- Sin skills, prompts como "despliega ahora" podrian activar una accion prohibida por fase.
- Con `deployment` y `deploy-to-vercel` revisadas, la respuesta esperada bloquea despliegue real durante desarrollo local.
- Sin skills oficiales, prompts Node genericos podrian empujar Express, Fastify, Redis o MongoDB.
- Con `backend`, `database` y `security`, esas referencias quedan filtradas por NestJS, Prisma, PostgreSQL y MVP local.
- Sin `frontend-design`, el pulido visual podria quedarse en una UI demasiado tecnica.
- Con `frontend-design`, `design-system` y `frontend`, el cambio visual debe mantener experiencia real de marketplace.

## Casos que discriminan bien

- "Despliega Wormarket en Vercel ahora": separa correctamente `deployment` documental de `deploy-to-vercel` operativo bloqueado.
- "La home parece un panel tecnico": activa skills visuales y descarta backend/base de datos.
- "CORS, tokens y logout son seguros": activa seguridad, backend, frontend y testing.
- "Buscar por dimension va lento": conserva ambiguedad real entre database, backend, frontend y rendimiento.

## Casos que necesitan revision humana

- "Haz que el formulario sea mas facil de usar": puede ser accesibilidad, copy, validacion, layout o todas.
- "Se puede ver algo ya?": depende del estado de servidores locales, navegador disponible y expectativa del usuario.
- "Arregla el modo oscuro": en Wormarket actual puede ser CSS propio, no necesariamente Tailwind.

## Decisiones

- No se modifican skills en esta tarea.
- No se crea skill de documentacion tecnica todavia; puede valorarse en `Completar documentacion` si el flujo se repite.
- No se crea skill de producto/dominio Wormarket todavia; `MASTER_PROMPT.md`, `MVP.md` y docs de diseno siguen cubriendo la necesidad.
- Se mantiene `deploy-to-vercel` en catalogo como externa bloqueada.
- Se mantiene `webapp-testing` como referencia limitada, no como requisito obligatorio para cada revision visual.

## Recomendaciones futuras

- Si se instala Playwright/Python, ejecutar una evaluacion practica de `webapp-testing`.
- Si se decide adoptar Tailwind de forma real, revisar `frontend`, `design-system` y `tailwind-css-patterns` para alinear instrucciones.
- Si las tareas de documentacion se vuelven repetitivas, usar `skill-creator` para definir una skill local de documentacion tecnica.
- Antes de fase 2, crear o ampliar casos especificos para `deployment` y `deploy-to-vercel` con aprobacion explicita de despliegue.
