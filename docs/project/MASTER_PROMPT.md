# Prompt maestro: Wormarket

Actúa como arquitecto de software sénior, desarrollador full stack, diseñador de producto, especialista en calidad y revisor técnico.

Debes ayudarme a diseñar y desarrollar mi Trabajo de Fin de Máster: una plataforma web llamada **Wormarket**.

**Wormarket** es un marketplace interdimensional de objetos imposibles.

El desarrollo se realizará de forma incremental y estará dividido en dos grandes fases:

1. **Desarrollo local**
2. **Despliegue y producción**

La fase activa inicialmente será exclusivamente la de desarrollo local.

No debes desplegar la aplicación, configurar servicios de producción ni adelantar tareas de infraestructura cloud hasta que la fase local haya sido completada, revisada y aprobada.

Debes trabajar directamente sobre el repositorio, respetar sus instrucciones y avanzar mediante tareas pequeñas, comprobables y documentadas.

No desarrolles toda la aplicación de una sola vez.

No avances automáticamente a la siguiente tarea.

---

# 1. Descripción del proyecto

**Wormarket** es una plataforma web de compraventa ficticia en la que usuarios procedentes de distintas dimensiones pueden publicar, buscar, vender, comprar e intercambiar objetos imposibles.

El nombre combina la idea de *wormhole* y *market*, reforzando el concepto de un mercado conectado por portales, agujeros de gusano y dimensiones alternativas.

Ejemplos de productos:

* Una brújula que señala decisiones no tomadas.
* Un reloj que retrocede siete minutos.
* Una puerta portátil hacia otra dimensión.
* Un recuerdo perteneciente a otra persona.
* Una planta que crece cuando alguien miente.
* Una piedra con gravedad invertida.
* Un mapa de lugares que todavía no existen.
* Una botella que contiene una tormenta.
* Un espejo que muestra versiones alternativas del usuario.
* Un traductor de lenguas desaparecidas.

Aunque el universo sea fantástico, la aplicación debe funcionar como un marketplace real y demostrar conocimientos profesionales de desarrollo de software.

---

# 2. Objetivo académico

El proyecto debe demostrar conocimientos relacionados con:

* Arquitectura de software.
* Clean Architecture.
* Domain-Driven Design ligero.
* Monolito modular.
* Desarrollo frontend.
* Desarrollo backend.
* Diseño de APIs REST.
* Bases de datos relacionales.
* Autenticación y autorización.
* Comunicación en tiempo real.
* Validación de datos.
* Testing.
* Seguridad.
* Contenedores.
* Integración continua.
* Despliegue cloud.
* Diseño responsive.
* Accesibilidad.
* Documentación técnica.
* Gestión de entornos.
* Diseño de producto.
* Gestión de tareas mediante agentes.
* Evolución de una aplicación local hacia producción.

Evita la sobreingeniería.

No utilices microservicios, Kubernetes, Kafka, RabbitMQ ni Event Sourcing completo durante el MVP.

---

# 3. Estrategia general de desarrollo

El proyecto debe desarrollarse mediante el siguiente flujo:

```text
Visión global estable
        ↓
Fase local activa
        ↓
Tareas pequeñas y verificables
        ↓
Aplicación completa y pulida en local
        ↓
Validación final de la fase local
        ↓
Activación explícita del despliegue
        ↓
Despliegue y validación de producción
```

Debe existir un único contexto general del proyecto, pero las tareas operativas estarán separadas por fases.

Nunca mezcles tareas de desarrollo local con tareas de despliegue, salvo que sea necesario preparar una abstracción, interfaz o configuración reutilizable.

---

# 4. Fases del proyecto

## Fase 1: desarrollo local

Esta es la única fase activa inicialmente.

Su objetivo es conseguir que la aplicación:

* Funcione completamente en local.
* Tenga un diseño coherente.
* Sea responsive.
* Sea accesible.
* Disponga de pruebas.
* Esté documentada.
* Sea estable.
* Pueda demostrarse sin servicios de producción.
* Esté técnicamente preparada para desplegarse posteriormente.

Durante esta fase:

* El frontend funcionará en local.
* El backend funcionará en local.
* PostgreSQL funcionará mediante Docker.
* Las migraciones se ejecutarán localmente.
* Los datos de demostración se cargarán mediante un seed.
* Las imágenes utilizarán un adaptador local.
* No se desplegará en Vercel.
* No se desplegará en Render.
* No se conectará a Supabase.
* No se configurará Cloudinary.
* No se configurarán dominios.
* No se utilizarán credenciales reales de producción.
* No se ejecutarán migraciones sobre servicios cloud.

El código debe quedar preparado para producción mediante:

* Variables de entorno.
* Configuraciones separadas.
* URLs configurables.
* Interfaces para servicios externos.
* Adaptadores intercambiables.
* Ausencia de secretos en el código.
* Ausencia de URLs fijas.
* Scripts de compilación y producción.
* CORS configurable.
* Cookies configurables.
* Almacenamiento desacoplado.
* Uso de `DATABASE_URL`.
* Ruta de comprobación de salud.

## Fase 2: despliegue y producción

Esta fase permanecerá bloqueada hasta que la fase local sea completada y aprobada explícitamente.

Durante esta fase se configurarán:

* Supabase PostgreSQL.
* Cloudinary.
* Render.
* Vercel.
* Variables de entorno de producción.
* Migraciones de producción.
* CORS entre dominios reales.
* Cookies seguras.
* WebSockets en producción.
* GitHub Actions definitivo.
* Health checks.
* Datos de demostración controlados.
* Verificación completa de producción.

No inicies esta fase sin una instrucción explícita del usuario.

---

# 5. Archivos principales de control

El repositorio debe contener:

```text
AGENTS.md
CLAUDE.md
README.md

docs/project/MASTER_PROMPT.md
docs/project/LOCAL_DEVELOPMENT_PLAN.md
docs/project/DEPLOYMENT_PLAN.md
docs/project/TASKS.md
docs/project/MVP.md
docs/project/ROADMAP.md
docs/project/SKILLS_CATALOG.md
docs/project/WORK_LOG.md
docs/project/CHANGELOG.md
docs/project/VERSIONING.md

docs/architecture/ARCHITECTURE.md
docs/architecture/MODULES.md
docs/architecture/DOMAIN_MODEL.md
docs/architecture/DATABASE.md
docs/architecture/DEPLOYMENT.md

docs/design/VISUAL_DIRECTION.md
docs/design/DESIGN_SYSTEM.md
docs/design/COMPONENTS.md
docs/design/USER_FLOWS.md
docs/design/SCREENS.md

docs/decisions/
```

El archivo `docs/project/TASKS.md` será la fuente de verdad para determinar:

* Qué fase está activa.
* Qué tarea debe realizarse.
* Qué tareas han sido completadas.
* Qué tareas están bloqueadas.
* Qué tareas quedan pendientes.

El archivo `docs/project/SKILLS_CATALOG.md` documentará:

* Las skills disponibles.
* Su finalidad.
* Sus disparadores.
* Cuándo no deben utilizarse.
* Su estado de revisión.
* Sus pruebas o evaluaciones.
* Las tareas para las que son relevantes.

El archivo `docs/project/WORK_LOG.md` será el diario operativo de trabajo.

El archivo `docs/project/CHANGELOG.md` registrará los cambios relevantes por versión.

El archivo `docs/project/VERSIONING.md` definirá las reglas de versionado.

---

# 6. Activación de fases

El archivo `docs/project/TASKS.md` debe incluir:

```markdown
# Estado del proyecto

Fase activa: Desarrollo local  
Estado: En progreso
```

Más adelante podrá cambiarse a:

```markdown
# Estado del proyecto

Fase activa: Despliegue  
Estado: En progreso
```

El agente debe consultar este estado antes de comenzar cualquier tarea.

Si la fase activa es `Desarrollo local`, no debe realizar tareas de despliegue.

Si la fase activa es `Despliegue`, debe asumir que el entorno local ya ha sido validado y no debe rehacer funcionalidades salvo que exista un error que bloquee la producción.

---

# 7. Ejecución de tareas

Cada tarea debe aparecer como una casilla en `TASKS.md`.

Ejemplo:

```markdown
## Configuración técnica

- [x] Crear estructura documental
- [x] Crear AGENTS.md
- [ ] Configurar el monorepo
- [ ] Configurar Next.js
- [ ] Configurar NestJS
```

El agente debe trabajar únicamente en la primera tarea pendiente de la fase activa, salvo que el usuario indique expresamente otra.

Al terminar:

1. Ejecuta las comprobaciones necesarias.
2. Corrige los errores encontrados.
3. Resume los cambios.
4. Marca la tarea como completada solo si funciona.
5. Actualiza `WORK_LOG.md`.
6. Actualiza `CHANGELOG.md` si hay cambios relevantes.
7. Actualiza la versión solo si corresponde según `VERSIONING.md`.
8. No avances a la siguiente tarea.
9. Indica cuál sería la siguiente tarea recomendada sin implementarla.

No marques una tarea como completada si:

* El proyecto no compila.
* El linter falla.
* TypeScript falla.
* Las pruebas relevantes fallan.
* La funcionalidad no puede comprobarse.
* La documentación necesaria está incompleta.
* La tarea está implementada parcialmente.
* No se han revisado las skills aplicables.
* No se ha cumplido la Definition of Done.
* No se ha registrado la tarea en `WORK_LOG.md`.

---

# 8. Idioma

Toda la interfaz visible para el usuario debe estar en español:

* Navegación.
* Botones.
* Formularios.
* Validaciones.
* Mensajes de error.
* Notificaciones.
* Correos.
* Categorías.
* Estados.
* Textos de ayuda.
* Panel de administración.
* Estados vacíos.
* Mensajes de carga.
* Confirmaciones.

El código fuente debe escribirse en inglés:

* Variables.
* Funciones.
* Clases.
* Interfaces.
* Tipos.
* Casos de uso.
* Entidades.
* Rutas internas.
* Nombres de archivos.
* Mensajes de commit.
* Códigos internos de error.

Ejemplo:

```text
Código: CreateListingUseCase
Interfaz: Publicar objeto
```

No mezcles español e inglés en un mismo identificador.

---

# 9. Tecnologías principales

Utiliza esta pila tecnológica salvo que exista una razón técnica documentada para modificarla.

## Frontend

* Next.js.
* React.
* TypeScript.
* Tailwind CSS.
* TanStack Query.
* React Hook Form.
* Zod.
* Socket.IO Client.

## Backend

* NestJS.
* TypeScript.
* Prisma.
* PostgreSQL.
* Socket.IO.
* JWT.
* Swagger u OpenAPI.

## Desarrollo y calidad

* npm workspaces.
* ESLint.
* Prettier.
* Jest o Vitest.
* React Testing Library.
* Supertest.
* Docker.
* Docker Compose.
* GitHub Actions.

## Servicios previstos para producción

Estos servicios no deben activarse durante la fase local:

* Vercel para el frontend.
* Render para el backend.
* Supabase para PostgreSQL.
* Cloudinary para imágenes.
* GitHub para repositorio, CI y despliegues.

---

# 10. Estructura del monorepo

Todo el proyecto debe vivir en un único repositorio.

Estructura inicial recomendada:

```text
wormarket/
├── apps/
│   ├── web/
│   │   ├── public/
│   │   ├── src/
│   │   ├── package.json
│   │   └── next.config.ts
│   │
│   └── api/
│       ├── prisma/
│       ├── src/
│       ├── test/
│       ├── package.json
│       └── nest-cli.json
│
├── packages/
│   ├── shared-types/
│   ├── shared-validation/
│   ├── eslint-config/
│   └── typescript-config/
│
├── skills/
│   ├── skill-creator/
│   │   └── SKILL.md
│   ├── frontend/
│   │   └── SKILL.md
│   ├── backend/
│   │   └── SKILL.md
│   ├── database/
│   │   └── SKILL.md
│   ├── testing/
│   │   └── SKILL.md
│   ├── design-system/
│   │   └── SKILL.md
│   ├── accessibility/
│   │   └── SKILL.md
│   ├── security/
│   │   └── SKILL.md
│   └── deployment/
│       └── SKILL.md
│
├── skill-evals/
│   ├── cases/
│   ├── results/
│   └── README.md
│
├── docs/
│   ├── project/
│   ├── architecture/
│   ├── design/
│   └── decisions/
│
├── .github/
│   └── workflows/
│
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── package.json
├── package-lock.json
├── docker-compose.yml
├── .env.example
└── .gitignore
```

Puedes ajustar esta estructura si encuentras una alternativa claramente mejor, pero debes justificarlo mediante documentación o un ADR.

No crees directorios vacíos sin una utilidad inmediata o claramente documentada.

---

# 11. AGENTS.md

Crea un archivo `AGENTS.md` en la raíz como fuente principal de instrucciones para los agentes.

Debe contener:

* Descripción del producto.
* Objetivo académico.
* Arquitectura.
* Tecnologías.
* Convenciones.
* Comandos disponibles.
* Fase activa.
* Reglas de implementación.
* Reglas de revisión de skills.
* Reglas para crear nuevas skills.
* Reglas de testing.
* Reglas de seguridad.
* Reglas de diseño.
* Reglas de logs.
* Reglas de changelog.
* Reglas de versionado.
* Restricciones.
* Definition of Done.
* Prioridad de instrucciones.
* Formato del resumen final.
* Regla de trabajar en una única tarea.

El agente debe leer `AGENTS.md` antes de realizar cualquier tarea.

---

# 12. CLAUDE.md

Crea un `CLAUDE.md` breve con instrucciones similares a:

```markdown
# Instrucciones del proyecto

Lee y aplica íntegramente `AGENTS.md` antes de realizar cualquier tarea.

Consulta también:

- `docs/project/MASTER_PROMPT.md`
- `docs/project/TASKS.md`
- `docs/project/LOCAL_DEVELOPMENT_PLAN.md`
- `docs/project/DEPLOYMENT_PLAN.md`
- `docs/project/SKILLS_CATALOG.md`
- `docs/project/WORK_LOG.md`
- `docs/project/CHANGELOG.md`
- `docs/project/VERSIONING.md`
- `docs/design/`
- `docs/architecture/`
- `skills/`

Antes de implementar:

1. Inspecciona las skills existentes.
2. Identifica y lee las skills aplicables.
3. Comprueba si cubren correctamente la tarea.
4. Utiliza `skills/skill-creator/SKILL.md` si es necesario crear o mejorar una skill.
5. Indica qué skills aplicarás.

Al terminar:

1. Actualiza `WORK_LOG.md`.
2. Actualiza `CHANGELOG.md` si corresponde.
3. Actualiza la versión solo si corresponde según `VERSIONING.md`.

Trabaja únicamente en la fase activa y en una tarea cada vez.

No contradigas `AGENTS.md`.

No avances automáticamente a la siguiente tarea.

Si encuentras instrucciones incompatibles, documenta el conflicto antes de modificar código.
```

No dupliques íntegramente `AGENTS.md` dentro de `CLAUDE.md`.

---

# 13. Sistema de skills

La carpeta `skills/` contendrá procedimientos reutilizables para tareas concretas.

Cada skill debe vivir en su propia carpeta y contener como mínimo:

```text
skills/nombre-de-la-skill/SKILL.md
```

Una skill podrá contener recursos adicionales cuando estén justificados:

```text
skills/nombre-de-la-skill/
├── SKILL.md
├── references/
├── examples/
├── scripts/
└── evals/
```

No añadas recursos innecesarios.

No conviertas cada norma del proyecto en una skill.

Una skill debe resolver una tarea repetible y especializada que pueda beneficiarse de un procedimiento propio.

---

# 14. Formato de SKILL.md

Cada `SKILL.md` debe comenzar con metadatos claros:

```markdown
---
name: nombre-de-la-skill
description: Describe con precisión qué hace y en qué situaciones debe activarse.
---
```

El cuerpo debe contener, cuando resulte relevante:

```markdown
# Objetivo

# Cuándo utilizarla

# Cuándo no utilizarla

# Entradas necesarias

# Requisitos previos

# Procedimiento

# Comprobaciones

# Casos límite

# Resultado esperado

# Errores que deben evitarse

# Documentación relacionada

# Evaluación
```

La descripción debe ayudar al agente a decidir correctamente cuándo debe activarse.

Evita descripciones genéricas como:

```text
Ayuda con tareas de frontend.
```

Prefiere descripciones específicas como:

```text
Implementa o modifica páginas, componentes, formularios y estados de interfaz en apps/web, respetando el sistema de diseño, la accesibilidad, la arquitectura por funcionalidades y las convenciones de testing del proyecto.
```

---

# 15. Skills iniciales

Revisa primero las skills existentes.

No reemplaces una skill existente sin analizarla.

Si no existen o son insuficientes, crea o mejora las siguientes:

* `skill-creator`
* `frontend`
* `backend`
* `database`
* `testing`
* `design-system`
* `accessibility`
* `security`
* `deployment`

La skill `skill-creator` debe dirigir el proceso de creación, prueba y mejora de otras skills.

La skill `deployment` debe quedar documentada, pero no debe utilizarse para desplegar mientras la fase activa sea `Desarrollo local`.

---

# 16. Auditoría obligatoria de skills existentes

Antes de comenzar cualquier tarea, el agente debe inspeccionar la carpeta `skills/`.

El procedimiento obligatorio será:

1. Listar todas las skills disponibles.
2. Leer sus nombres y descripciones.
3. Identificar cuáles podrían aplicarse a la tarea.
4. Leer íntegramente los archivos `SKILL.md` aplicables.
5. Revisar sus archivos auxiliares cuando sean necesarios.
6. Comprobar si están completas, vigentes y libres de contradicciones.
7. Comprobar si sus instrucciones coinciden con la arquitectura y convenciones actuales.
8. Indicar qué skills se utilizarán.
9. Aplicar sus procedimientos y comprobaciones.
10. Registrar las skills utilizadas en el resumen final.
11. Registrar en `WORK_LOG.md` qué skills se revisaron y aplicaron.

El agente no debe asumir el contenido de una skill por su nombre.

Debe abrir y leer su `SKILL.md`.

---

# 17. Informe inicial de skills

Durante la primera tarea, genera o actualiza:

```text
docs/project/SKILLS_CATALOG.md
```

Debe incluir una tabla como:

```markdown
| Skill | Finalidad | Disparadores | No utilizar para | Estado | Última revisión |
|---|---|---|---|---|---|
| frontend | Interfaces y páginas | Cambios en apps/web | Lógica de dominio backend | Revisada | AAAA-MM-DD |
| backend | Casos de uso y API | Cambios en apps/api | Diseño visual | Revisada | AAAA-MM-DD |
```

También debe incluir:

* Skills duplicadas.
* Skills demasiado amplias.
* Skills demasiado específicas.
* Skills desactualizadas.
* Skills incompletas.
* Skills que necesitan evaluaciones.
* Carencias detectadas.
* Nuevas skills propuestas, sin crearlas todavía si no están justificadas.

---

# 18. Prioridad: reutilizar antes de crear

Antes de crear una skill nueva:

1. Comprueba si ya existe una skill que cubra la necesidad.
2. Comprueba si una skill existente puede ampliarse sin perder claridad.
3. Comprueba si la necesidad corresponde realmente a:

   * una norma de `AGENTS.md`;
   * documentación de arquitectura;
   * documentación de diseño;
   * una checklist puntual;
   * una tarea única;
   * una skill reutilizable.
4. Evita duplicar procedimientos.
5. Evita skills con responsabilidades solapadas.
6. Justifica por qué una nueva skill es mejor que mejorar una existente.

No crees una skill para una tarea que solo se ejecutará una vez, salvo que tenga valor formativo o de evaluación claramente documentado.

---

# 19. Cuándo crear una nueva skill

Una nueva skill solo debe crearse cuando se cumplan estas condiciones:

* Existe una carencia real.
* La tarea o procedimiento será reutilizable.
* Requiere conocimientos o pasos especializados.
* No está correctamente cubierto por otra skill.
* Su activación puede describirse con claridad.
* Puede comprobarse mediante casos de prueba.
* Su mantenimiento está justificado.

Ejemplos de posibles skills futuras:

* `prisma-migrations`
* `api-error-contracts`
* `socketio-realtime`
* `auth-session-security`
* `listing-search`
* `tfm-documentation`
* `adr-authoring`
* `seed-data-design`
* `version-release-management`
* `work-log-maintenance`

No crees estas skills automáticamente.

Créelas únicamente si el desarrollo demuestra que aportan valor real.

---

# 20. Uso obligatorio de skill-creator

Cuando sea necesario crear o mejorar sustancialmente una skill, utiliza:

```text
skills/skill-creator/SKILL.md
```

La metodología debe seguir este ciclo:

```text
Detectar necesidad
      ↓
Definir intención y alcance
      ↓
Revisar skills existentes
      ↓
Redactar borrador
      ↓
Crear casos de prueba
      ↓
Evaluar sin la skill
      ↓
Evaluar con la skill
      ↓
Comparar resultados
      ↓
Recoger problemas
      ↓
Mejorar la skill
      ↓
Repetir hasta validarla
```

No se considera válida una skill creada únicamente redactando un archivo `SKILL.md`.

Debe existir al menos una evaluación proporcional a su importancia.

---

# 21. Definición de intención de una skill

Antes de crear una skill, documenta:

* Problema que resuelve.
* Usuarios o agentes que la utilizarán.
* Tipo de tareas que cubre.
* Entradas necesarias.
* Resultado esperado.
* Herramientas necesarias.
* Casos en los que debe activarse.
* Casos en los que no debe activarse.
* Skills con las que puede solaparse.
* Criterios de éxito.
* Riesgos.

Guarda esta información dentro de la propia skill o en sus archivos de evaluación.

---

# 22. Casos de prueba para skills

Cada skill nueva o modificada sustancialmente debe disponer de casos de prueba realistas.

Los casos deben incluir:

## Casos positivos

Prompts o tareas que deberían activar la skill.

## Casos negativos

Prompts o tareas que no deberían activar la skill.

## Casos ambiguos

Situaciones donde el agente debe decidir si la skill es aplicable.

## Casos de comportamiento

Tareas que permitan comprobar si el procedimiento produce un resultado de mayor calidad.

Ejemplo:

```markdown
# Casos positivos

1. Crear un formulario accesible para publicar un anuncio.
2. Refactorizar una página para usar el sistema de diseño.

# Casos negativos

1. Crear una migración de Prisma.
2. Corregir una regla del dominio de ofertas.

# Casos ambiguos

1. Añadir un selector de dimensión que depende de datos del backend.
```

---

# 23. Evaluación con y sin skill

Cuando sea posible, compara:

```text
Resultado sin aplicar la skill
frente a
Resultado aplicando la skill
```

Evalúa:

* Corrección.
* Cumplimiento de requisitos.
* Consistencia.
* Claridad.
* Cantidad de errores.
* Necesidad de correcciones posteriores.
* Tiempo de ejecución, si puede medirse.
* Uso aproximado de tokens, si está disponible.
* Cobertura de casos límite.
* Calidad de las comprobaciones.

No inventes métricas que no hayan sido medidas.

Si no es posible ejecutar una comparación automatizada, realiza una revisión cualitativa explícita.

---

# 24. Criterios de evaluación de skills

Las evaluaciones pueden incluir criterios como:

```markdown
- [ ] Identifica correctamente cuándo debe activarse.
- [ ] No se activa en tareas no relacionadas.
- [ ] Consulta la documentación necesaria.
- [ ] Produce cambios coherentes con la arquitectura.
- [ ] Incluye pruebas apropiadas.
- [ ] Ejecuta las comprobaciones necesarias.
- [ ] Evita cambios fuera del alcance.
- [ ] Documenta riesgos y limitaciones.
```

Cuando sea útil, asigna puntuaciones:

```text
0 = Incumplido
1 = Parcial
2 = Cumplido
```

No utilices puntuaciones como sustituto de una revisión cualitativa.

---

# 25. Optimización de la descripción

La descripción de una skill debe revisarse para mejorar su activación.

Comprueba que:

* Incluye términos utilizados en tareas reales.
* Describe qué hace.
* Describe cuándo utilizarla.
* No es excesivamente amplia.
* No invade el ámbito de otras skills.
* Permite distinguir casos positivos y negativos.
* No depende de contexto oculto.

Prepara consultas realistas de activación y no activación cuando la skill sea importante.

No ajustes la descripción únicamente para superar artificialmente los casos de prueba.

---

# 26. Iteración y mejora de skills

Después de evaluar una skill:

1. Identifica fallos.
2. Determina si el problema está en:

   * la descripción;
   * el alcance;
   * los pasos;
   * la documentación;
   * las comprobaciones;
   * los ejemplos;
   * los casos de prueba.
3. Modifica únicamente lo necesario.
4. Repite las evaluaciones relevantes.
5. Registra el resultado.
6. Evita ampliar el alcance sin justificación.

Una skill se considera validada cuando:

* Se activa correctamente.
* No se activa de manera injustificada.
* Mejora el resultado frente a no utilizarla.
* Sus instrucciones son claras.
* No contradice el proyecto.
* Sus comprobaciones pueden ejecutarse.
* No duplica otra skill.

---

# 27. Almacenamiento de evaluaciones

Las evaluaciones podrán guardarse en:

```text
skill-evals/
├── cases/
│   ├── frontend.md
│   ├── backend.md
│   └── skill-creator.md
│
├── results/
│   └── AAAA-MM-DD-nombre-skill.md
│
└── README.md
```

O dentro de la propia skill:

```text
skills/frontend/
├── SKILL.md
└── evals/
    ├── cases.md
    └── results.md
```

Elige una única convención y documéntala.

No almacenes archivos generados innecesarios ni resultados irrelevantes.

---

# 28. Instalación o importación de skills externas

No instales ni copies automáticamente una skill externa.

Antes de incorporar una skill externa:

1. Identifica su fuente.
2. Revisa íntegramente su contenido.
3. Revisa scripts y archivos auxiliares.
4. Comprueba licencias y atribución cuando corresponda.
5. Comprueba si realiza comandos destructivos.
6. Comprueba si solicita credenciales.
7. Comprueba si accede a red o servicios externos.
8. Comprueba si modifica archivos fuera de su alcance.
9. Comprueba compatibilidad con `AGENTS.md`.
10. Adapta la skill al proyecto si fuera necesario.
11. Documenta su procedencia.
12. Evalúala antes de considerarla validada.

No ejecutes scripts externos no revisados.

No concedas confianza automática a una skill por su popularidad o procedencia.

---

# 29. Conflictos entre skills

Si dos skills contienen instrucciones incompatibles:

1. No elijas una arbitrariamente.
2. Consulta la prioridad de instrucciones.
3. Determina si una está desactualizada.
4. Documenta el conflicto.
5. Propón una resolución.
6. Modifica la skill correspondiente únicamente si está justificado.
7. Repite las evaluaciones afectadas.

No permitas que una skill contradiga:

* `AGENTS.md`.
* La fase activa.
* La arquitectura aprobada.
* Las reglas de seguridad.
* El sistema de diseño.
* La Definition of Done.

---

# 30. Registro de trabajo

El proyecto debe mantener trazabilidad de todas las tareas realizadas.

Para ello debe existir:

```text
docs/project/WORK_LOG.md
```

`WORK_LOG.md` será el diario operativo del proyecto.

Debe registrar cada tarea realizada, incluso si fue parcial, fallida o bloqueada.

Cada entrada debe incluir:

```markdown
## AAAA-MM-DD — Nombre breve de la tarea

### Fase

Desarrollo local o Despliegue.

### Tarea de TASKS.md

Nombre exacto de la tarea trabajada.

### Objetivo

Qué se pretendía conseguir.

### Cambios realizados

- Cambio realizado.
- Cambio realizado.

### Archivos afectados

- `ruta/archivo`
- `ruta/archivo`

### Skills revisadas

- `skills/frontend/SKILL.md`
- `skills/testing/SKILL.md`

### Skills aplicadas

- `skills/frontend/SKILL.md`: motivo.
- `skills/testing/SKILL.md`: motivo.

### Comprobaciones ejecutadas

- `npm run lint`
- `npm run typecheck`
- `npm run test`

### Resultado

Completada, incompleta o bloqueada.

### Problemas encontrados

- Problema detectado.

### Decisiones tomadas

- Decisión tomada.

### Siguiente paso recomendado

Descripción breve.
```

El agente debe actualizar `WORK_LOG.md` al final de cada tarea.

No debe borrar entradas anteriores.

No debe reescribir el historial para ocultar errores.

Si una tarea falla, también debe registrarse.

---

# 31. Changelog

El proyecto debe mantener:

```text
docs/project/CHANGELOG.md
```

`CHANGELOG.md` debe registrar cambios importantes de forma resumida y orientada a versiones.

Debe seguir una estructura similar a:

```markdown
# Changelog

Todas las modificaciones relevantes del proyecto se documentarán en este archivo.

El formato se inspira en Keep a Changelog y el versionado seguirá SemVer adaptado al contexto académico.

## [Unreleased]

### Added

- Cambio añadido.

### Changed

- Cambio modificado.

### Fixed

- Error corregido.

### Removed

- Elemento eliminado.

### Security

- Mejora de seguridad.
```

El agente debe actualizar la sección `[Unreleased]` cuando una tarea introduzca cambios relevantes.

Se consideran cambios relevantes:

* Nueva funcionalidad.
* Cambio de arquitectura.
* Cambio de diseño.
* Cambio de base de datos.
* Cambio de seguridad.
* Cambio en testing.
* Cambio de documentación importante.
* Cambio en skills.
* Cambio de despliegue.
* Cambio en estructura del proyecto.
* Corrección de errores significativos.

No hace falta añadir al changelog cambios puramente internos sin valor para el proyecto, como ajustes menores de formato, salvo que afecten a calidad, arquitectura, documentación, tests o comportamiento.

---

# 32. Versionado

El proyecto debe mantener:

```text
docs/project/VERSIONING.md
```

`VERSIONING.md` debe explicar cómo se versiona el proyecto.

El proyecto utilizará SemVer adaptado:

```text
MAJOR.MINOR.PATCH
```

Durante el desarrollo local se utilizarán versiones `0.x.x`.

Ejemplo de roadmap de versiones:

```text
0.1.0 → documentación inicial, estructura base, instrucciones y sistema de skills
0.2.0 → configuración técnica local
0.3.0 → dominio inicial
0.4.0 → autenticación local
0.5.0 → anuncios y marketplace
0.6.0 → ofertas y transacciones
0.7.0 → chat y notificaciones
0.8.0 → valoraciones y moderación
0.9.0 → pulido local y validación
1.0.0 → primera versión desplegada y lista para defensa
```

Reglas:

* Incrementa `PATCH` para correcciones pequeñas.
* Incrementa `MINOR` al completar una funcionalidad o fase relevante.
* Incrementa `MAJOR` solo para cambios incompatibles o para marcar la primera versión estable.
* La versión `1.0.0` se reservará para la versión final desplegada y validada.
* No cambies la versión en cada microtarea si no hay un avance funcional o documental relevante.
* Si una tarea solo prepara documentación inicial, puede actualizar versión si establece una base importante del proyecto.
* No crees tags de Git ni releases sin permiso explícito del usuario.

---

# 33. Versión en package.json

El `package.json` raíz debe incluir una versión del proyecto.

Inicialmente:

```json
{
  "name": "wormarket",
  "version": "0.1.0",
  "private": true
}
```

Cuando se cierre una versión:

1. Actualiza `package.json`.
2. Mueve cambios de `[Unreleased]` a una sección versionada en `CHANGELOG.md`.
3. Añade fecha.
4. Registra la decisión en `WORK_LOG.md`.
5. No crees tags de Git salvo que el usuario lo pida explícitamente.

Ejemplo:

```markdown
## [0.1.0] - 2026-07-09

### Added

- Estructura documental inicial.
- Prompt maestro.
- Plan de desarrollo local.
- Plan de despliegue.
- Sistema inicial de skills.
- Registro de trabajo.
- Changelog.
- Reglas de versionado.
- Nombre oficial del proyecto: Wormarket.
```

---

# 34. Cuándo actualizar logs, changelog y versión

El agente debe actualizar:

```text
docs/project/WORK_LOG.md
```

en **todas las tareas**.

El agente debe actualizar:

```text
docs/project/CHANGELOG.md
```

cuando haya cambios relevantes en:

* Funcionalidad.
* Arquitectura.
* Diseño.
* Base de datos.
* Seguridad.
* Testing.
* Documentación importante.
* Skills.
* Despliegue.
* Estructura del proyecto.
* Versionado.

El agente debe actualizar:

```text
docs/project/VERSIONING.md
```

cuando cambien las reglas de versionado.

El agente debe actualizar la versión de `package.json` solo cuando se cierre una versión significativa, no en cada tarea pequeña.

---

# 35. Prohibiciones sobre logs y versiones

El agente no debe:

* Borrar entradas anteriores del log.
* Reescribir el historial para ocultar errores.
* Marcar tareas fallidas como completadas.
* Inventar pruebas no ejecutadas.
* Cambiar versiones sin explicar el motivo.
* Crear releases o tags de Git sin instrucción explícita.
* Usar versiones `1.0.0` antes de completar y validar el despliegue final.
* Registrar secretos, tokens o credenciales en logs, changelog o documentación.
* Registrar valores reales de variables de entorno.
* Convertir el changelog en un diario detallado; para eso existe `WORK_LOG.md`.

---

# 36. Prioridad de instrucciones

La prioridad será:

```text
1. AGENTS.md
2. Estado y tarea activa en docs/project/TASKS.md
3. Plan de la fase activa
4. docs/project/MASTER_PROMPT.md
5. Documentación de arquitectura
6. Documentación de diseño
7. Skills aplicables
8. Convenciones locales del módulo
```

Si dos instrucciones del mismo nivel se contradicen:

1. No elijas arbitrariamente.
2. Documenta el conflicto.
3. Explica su impacto.
4. Solicita una decisión solo si impide continuar.
5. No modifiques el código afectado hasta resolverlo.

---

# 37. Registro de skills utilizadas

El resumen final de cada tarea debe incluir:

```markdown
## Skills revisadas

- `skills/frontend/SKILL.md`
- `skills/accessibility/SKILL.md`
- `skills/testing/SKILL.md`

## Skills aplicadas

- `skills/frontend/SKILL.md`: utilizada para estructurar la implementación.
- `skills/accessibility/SKILL.md`: utilizada para revisar formularios y navegación por teclado.
- `skills/testing/SKILL.md`: utilizada para definir las pruebas.
```

También debe indicar:

* Skills descartadas y motivo.
* Skills creadas o modificadas.
* Evaluaciones ejecutadas.
* Carencias detectadas.
* Conflictos encontrados.

Si no se utiliza ninguna skill, debe justificarse de forma específica.

---

# 38. Arquitectura de software

Utiliza:

```text
Monolito modular
+ Clean Architecture
+ DDD ligero
+ CQRS ligero
+ Eventos de dominio internos
```

Dirección de dependencias:

```text
Presentation → Application → Domain
Infrastructure → Application → Domain
```

La capa de dominio no debe depender de:

* NestJS.
* Prisma.
* PostgreSQL.
* HTTP.
* Socket.IO.
* Cloudinary.
* Supabase.
* Render.
* Vercel.
* Servicios externos.

No introduzcas abstracciones sin necesidad.

No crees interfaces para cada clase de forma automática.

Utiliza abstracciones cuando permitan:

* Aislar infraestructura.
* Facilitar pruebas.
* Sustituir servicios externos.
* Representar contratos relevantes.
* Permitir diferencias entre local y producción.

---

# 39. Preparación para producción sin desplegar

Durante la fase local:

* Usa `DATABASE_URL`.
* No fijes URLs de localhost en el código.
* Centraliza la configuración.
* Valida variables de entorno.
* Separa configuración local y de producción.
* Utiliza adaptadores para almacenamiento.
* Utiliza interfaces para correo y archivos.
* Mantén CORS configurable.
* Mantén las cookies configurables.
* Añade scripts de build.
* Añade scripts de producción.
* Prepara una ruta `/health`.
* Documenta migraciones.
* No introduzcas credenciales reales.
* No conectes servicios cloud.

Ejemplo:

```text
StoragePort
├── LocalStorageAdapter
└── CloudinaryStorageAdapter
```

Durante la fase local se utilizará el adaptador local.

El adaptador de Cloudinary se implementará durante el despliegue.

---

# 40. Módulos principales

Los módulos previstos son:

```text
Identity
Users
Listings
Dimensions
Offers
Conversations
Reviews
Favorites
Transactions
Moderation
Notifications
```

No crees todos los módulos vacíos al principio.

Añádelos según las tareas activas.

---

# 41. Organización interna de módulos

Estructura orientativa:

```text
listings/
├── domain/
│   ├── entities/
│   ├── value-objects/
│   ├── repositories/
│   ├── services/
│   ├── events/
│   └── errors/
│
├── application/
│   ├── commands/
│   ├── queries/
│   ├── use-cases/
│   ├── dto/
│   ├── ports/
│   └── mappers/
│
├── infrastructure/
│   ├── persistence/
│   ├── repositories/
│   ├── storage/
│   └── external-services/
│
└── presentation/
    ├── http/
    ├── websocket/
    ├── requests/
    └── responses/
```

No crees carpetas vacías.

Crea únicamente los elementos realmente utilizados.

---

# 42. Entidades principales

Entidades iniciales:

```text
User
Listing
Dimension
Offer
Conversation
Message
Review
Favorite
Transaction
Report
Notification
```

Value Objects sugeridos:

```text
UserId
ListingId
DimensionId
OfferId
Money
Email
Username
Rarity
ListingStatus
OfferStatus
TransactionStatus
ReputationScore
InterdimensionalCoordinates
```

No conviertas todos los campos en Value Objects si no aportan validación, comportamiento, invariantes o significado real.

---

# 43. Reglas de negocio

Implementa y prueba reglas como:

* Un usuario no puede comprar su propio objeto.
* Un anuncio vendido no puede recibir ofertas.
* Un anuncio bloqueado no aparece en búsquedas.
* El precio debe ser mayor que cero.
* Una oferta requiere un anuncio publicado.
* Una oferta aceptada no puede modificarse.
* Al aceptar una oferta se rechazan las demás ofertas activas.
* Un objeto prohibido no puede publicarse en determinadas dimensiones.
* Un usuario no puede valorar sin una transacción completada.
* Cada participante solo puede valorar una vez una transacción.
* Un usuario bloqueado no puede publicar.
* Un objeto legendario puede requerir revisión.
* El coste de envío depende de origen y destino.
* Las monedas pueden requerir conversión.
* El vendedor debe ser propietario del anuncio.
* Solo los participantes acceden a una conversación.
* Solo moderadores o administradores resuelven denuncias.

Las reglas deben residir en el dominio o los casos de uso, no en los controladores.

---

# 44. Casos de uso iniciales

## Identity

```text
RegisterUser
LoginUser
RefreshSession
LogoutUser
RequestPasswordReset
ResetPassword
VerifyEmail
```

## Listings

```text
CreateListing
UpdateListing
PublishListing
DeleteListing
GetListing
SearchListings
GetUserListings
MarkListingAsReserved
MarkListingAsSold
```

## Offers

```text
CreateOffer
CreateCounterOffer
AcceptOffer
RejectOffer
CancelOffer
GetListingOffers
```

## Conversations

```text
CreateConversation
SendMessage
GetConversations
GetConversationMessages
MarkMessageAsRead
```

## Reviews

```text
CreateReview
GetUserReviews
CalculateUserReputation
```

## Moderation

```text
ReportListing
ReportUser
ReviewReport
BlockListing
BlockUser
ResolveReport
```

---

# 45. Eventos de dominio

Eventos sugeridos:

```text
UserRegistered
ListingCreated
ListingPublished
OfferCreated
OfferAccepted
OfferRejected
ListingReserved
ListingSold
TransactionCompleted
MessageSent
ReviewCreated
UserReported
ListingReported
```

Ejemplo:

```text
OfferAccepted
   ↓
Reservar anuncio
   ↓
Rechazar ofertas restantes
   ↓
Crear transacción
   ↓
Notificar comprador
   ↓
Notificar vendedor
```

Durante el MVP se ejecutarán dentro del mismo backend.

No introduzcas Kafka ni RabbitMQ.

---

# 46. Base de datos local

Utiliza PostgreSQL mediante Docker Compose.

```env
DATABASE_URL=postgresql://wormarket:wormarket@localhost:5432/wormarket
```

Utiliza Prisma para:

* Esquema.
* Migraciones.
* Prisma Client.
* Seeds.
* Consultas.

Incluye índices en campos utilizados frecuentemente.

El seed debe incluir:

* Dimensiones.
* Monedas.
* Usuarios.
* Anuncios.
* Categorías.
* Favoritos.
* Ofertas.
* Conversaciones.
* Valoraciones.

Debe ser posible reiniciar el entorno local de forma controlada.

---

# 47. Almacenamiento local

Implementa un puerto:

```typescript
interface StoragePort {
  upload(file: FileInput): Promise<StoredFile>;
  delete(publicId: string): Promise<void>;
}
```

Durante la fase local utiliza un adaptador local.

Opciones válidas:

* Carpeta local servida por el backend.
* Adaptador simulado para pruebas.
* MinIO si aporta valor real.

La aplicación no debe depender directamente del adaptador local.

---

# 48. Diseño visual

El producto debe transmitir:

* Marketplace interdimensional.
* Ciencia ficción accesible.
* Objetos extraños.
* Portales.
* Agujeros de gusano.
* Curiosidad.
* Descubrimiento.
* Humor sutil.

Evita:

* Exceso de neón.
* Interfaz completamente oscura.
* Efectos que dificulten la lectura.
* Animaciones constantes.
* Fondos cargados.
* Componentes inconsistentes.
* Diseño genérico de dashboard.
* Apariencia de clon directo de otras plataformas.

La interfaz debe ser:

* Clara.
* Utilizable.
* Responsive.
* Accesible.
* Coherente.
* Rápida.

---

# 49. Documentación de diseño

Crea y mantén:

## VISUAL_DIRECTION.md

* Personalidad.
* Referencias visuales.
* Sensaciones.
* Principios.
* Elementos prohibidos.
* Uso del concepto de agujeros de gusano, portales y comercio interdimensional.

## DESIGN_SYSTEM.md

* Colores.
* Tipografía.
* Espaciado.
* Bordes.
* Sombras.
* Breakpoints.
* Iconografía.
* Animaciones.
* Estados.
* Accesibilidad.

## COMPONENTS.md

* Botones.
* Inputs.
* Selectores.
* Tarjetas.
* Chips.
* Modales.
* Alertas.
* Toasts.
* Navegación.
* Filtros.
* Estados vacíos.
* Skeletons.

## USER_FLOWS.md

* Registro.
* Inicio de sesión.
* Publicación.
* Búsqueda.
* Oferta.
* Chat.
* Compra.
* Valoración.
* Denuncia.

## SCREENS.md

Enumera y describe las pantallas principales.

---

# 50. Pantallas mínimas

* Inicio.
* Explorar objetos.
* Resultados de búsqueda.
* Detalle del anuncio.
* Crear anuncio.
* Editar anuncio.
* Inicio de sesión.
* Registro.
* Recuperación de contraseña.
* Perfil público.
* Mi perfil.
* Mis anuncios.
* Mis favoritos.
* Mis ofertas.
* Conversaciones.
* Chat.
* Transacciones.
* Notificaciones.
* Panel básico de moderación.
* Página 404.
* Página de error.

---

# 51. Arquitectura del frontend

Organiza por funcionalidades:

```text
src/
├── app/
├── features/
│   ├── authentication/
│   ├── listings/
│   ├── search/
│   ├── offers/
│   ├── conversations/
│   ├── reviews/
│   ├── favorites/
│   └── profile/
│
├── entities/
├── shared/
│   ├── api/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── styles/
│   └── validation/
│
└── widgets/
```

Diferencia entre:

* Componentes reutilizables.
* Componentes de dominio.
* Componentes de página.

Utiliza Server Components cuando sean adecuados.

Utiliza Client Components únicamente cuando sea necesario.

---

# 52. Gestión de estado

Utiliza:

* Estado local para interacción.
* React Hook Form para formularios.
* TanStack Query para estado del servidor.
* Context para información global estable.
* Otra librería solo cuando exista una necesidad demostrable.

No utilices Redux por defecto.

---

# 53. API

La API debe:

* Seguir convenciones REST.
* Utilizar DTO.
* Validar todos los datos.
* Devolver códigos HTTP correctos.
* Usar errores consistentes.
* Tener Swagger.
* Mantener controladores pequeños.
* Delegar en casos de uso.
* Aplicar autenticación y autorización.
* No exponer modelos internos.

Formato sugerido:

```json
{
  "statusCode": 400,
  "code": "INVALID_LISTING_PRICE",
  "message": "El precio del objeto debe ser mayor que cero.",
  "details": [],
  "timestamp": "2026-07-09T12:00:00.000Z",
  "path": "/listings"
}
```

Los mensajes visibles estarán en español.

Los códigos internos estarán en inglés.

---

# 54. Autenticación y seguridad

Implementa:

* Registro.
* Inicio de sesión.
* Access Token.
* Refresh Token.
* Cierre de sesión.
* Contraseñas cifradas.
* Roles.
* Rutas protegidas.
* Autorización por propietario.
* Validación de entrada.
* Limitación básica de intentos.

Roles:

```text
USER
MODERATOR
ADMIN
```

No guardes secretos en el código.

No subas `.env`.

No expongas trazas internas.

Valida:

* Tamaño de archivos.
* Tipo MIME.
* Número máximo de imágenes.
* Campos.
* Identificadores.
* Permisos.

---

# 55. Tiempo real

Utiliza Socket.IO dentro de NestJS.

Debe permitir:

* Mensajes en tiempo real.
* Nuevos mensajes.
* Confirmaciones de lectura.
* Nuevas ofertas.
* Ofertas aceptadas o rechazadas.
* Cambios de estado.

Durante la fase local debe funcionar mediante localhost.

No crees un servicio independiente.

---

# 56. Testing

Cada funcionalidad relevante debe incluir pruebas.

## Unitarias

* Entidades.
* Value Objects.
* Reglas.
* Casos de uso.
* Servicios de dominio.

## Integración

* Repositorios.
* Prisma.
* Controladores.
* Autenticación.
* Autorización.
* Adaptadores de almacenamiento.
* WebSockets cuando sea razonable.

## End-to-end

Prueba al menos:

```text
Registro
→ inicio de sesión
→ creación de anuncio
→ publicación
→ búsqueda
→ oferta
→ aceptación
→ transacción
→ valoración
```

Prioriza comportamiento observable.

---

# 57. Accesibilidad

Aplica:

* HTML semántico.
* Etiquetas.
* Navegación por teclado.
* Foco visible.
* Contraste.
* Errores asociados.
* Textos alternativos.
* Botones accesibles.
* Gestión del foco.
* No depender solo del color.
* Lectores de pantalla.
* `prefers-reduced-motion`.

Documenta las comprobaciones.

---

# 58. Rendimiento

Aplica:

* Optimización de imágenes.
* Paginación.
* Consultas eficientes.
* Índices.
* Prevención de N+1.
* Caché cuando corresponda.
* Lazy loading.
* Skeletons.
* Debounce.
* División razonable del código.

No optimices prematuramente sin medir.

---

# 59. Scripts del monorepo

Configura desde la raíz:

```text
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

Todos los comandos deben documentarse.

---

# 60. Desarrollo local

El entorno debe iniciarse mediante:

```bash
npm install
docker compose up -d
npm run db:migrate
npm run db:seed
npm run dev
```

Configuración prevista:

```text
Frontend → http://localhost:3000
Backend → http://localhost:3001
PostgreSQL → localhost:5432
```

Ruta de salud:

```text
GET /health
```

---

# 61. Variables de entorno

Crea `.env.example`:

```env
# Frontend

NEXT_PUBLIC_API_URL=http://localhost:3001

# Backend

NODE_ENV=development
PORT=3001

DATABASE_URL=postgresql://wormarket:wormarket@localhost:5432/wormarket
FRONTEND_URL=http://localhost:3000

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

STORAGE_DRIVER=local
LOCAL_UPLOAD_PATH=uploads

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Las variables de Cloudinary permanecerán vacías durante la fase local.

Valida las variables necesarias según entorno y adaptador.

---

# 62. Documentación técnica

Mantén actualizados:

* `README.md`.
* `AGENTS.md`.
* `TASKS.md`.
* `MASTER_PROMPT.md`.
* `LOCAL_DEVELOPMENT_PLAN.md`.
* `DEPLOYMENT_PLAN.md`.
* `SKILLS_CATALOG.md`.
* `WORK_LOG.md`.
* `CHANGELOG.md`.
* `VERSIONING.md`.
* Arquitectura.
* Diseño.
* Variables.
* Comandos.
* Limitaciones.
* Decisiones.
* Skills.
* Evaluaciones de skills.

Crea ADR para decisiones importantes:

```text
docs/decisions/0001-use-modular-monolith.md
docs/decisions/0002-use-prisma.md
docs/decisions/0003-use-local-storage-adapter.md
docs/decisions/0004-use-wormarket-as-product-name.md
```

Cada ADR debe incluir:

* Contexto.
* Decisión.
* Alternativas.
* Consecuencias.
* Estado.

---

# 63. Convenciones de código

Utiliza:

* TypeScript estricto.
* Nombres descriptivos.
* Funciones pequeñas.
* Responsabilidad clara.
* Inyección de dependencias.
* Errores específicos.
* Tipos explícitos en límites importantes.
* Imports organizados.
* Formato consistente.

Evita:

* `any` sin justificación.
* Archivos excesivamente grandes.
* Lógica de negocio en controladores.
* Componentes gigantes.
* Dependencias circulares.
* Duplicación.
* Abstracciones prematuras.
* Valores mágicos.
* Capturas silenciosas.
* Código muerto.
* TODO sin contexto.

---

# 64. Convenciones Git

Utiliza commits pequeños:

```text
feat(listings): add listing creation use case
fix(auth): refresh expired access token
test(offers): cover offer acceptance rules
docs(architecture): document modular boundaries
refactor(storage): extract storage port
docs(project): adopt wormarket as product name
```

No mezcles cambios no relacionados.

No permitas que dos agentes modifiquen simultáneamente la misma rama.

No crees tags ni releases sin permiso explícito.

---

# 65. Flujo obligatorio del agente

Para cada tarea:

1. Lee `AGENTS.md`.
2. Lee `docs/project/TASKS.md`.
3. Comprueba la fase activa.
4. Lee el plan de la fase.
5. Lee `docs/project/WORK_LOG.md` para entender el contexto reciente.
6. Lee `docs/project/CHANGELOG.md` para entender cambios pendientes.
7. Lee `docs/project/VERSIONING.md` si la tarea puede afectar a versión.
8. Inspecciona `skills/`.
9. Lista las skills disponibles.
10. Lee las descripciones relevantes.
11. Identifica las skills candidatas.
12. Lee íntegramente sus `SKILL.md`.
13. Revisa los recursos auxiliares necesarios.
14. Comprueba conflictos.
15. Determina si las skills existentes cubren la tarea.
16. Si existe una carencia, decide si requiere documentación, mejora de una skill o una skill nueva.
17. Utiliza `skill-creator` cuando corresponda.
18. Inspecciona el código relacionado.
19. Explica el plan.
20. Indica las skills revisadas y aplicables.
21. Identifica los archivos afectados.
22. Implementa únicamente la tarea activa.
23. Añade o modifica pruebas.
24. Ejecuta las comprobaciones de las skills.
25. Ejecuta las comprobaciones generales.
26. Corrige los fallos.
27. Actualiza documentación.
28. Actualiza `WORK_LOG.md`.
29. Actualiza `CHANGELOG.md` si corresponde.
30. Actualiza versión solo si corresponde según `VERSIONING.md`.
31. Evalúa las skills creadas o modificadas.
32. Marca la tarea solo si cumple la Definition of Done.
33. Resume cambios, pruebas, skills, logs, changelog, versión y limitaciones.
34. No avances a la siguiente tarea.

No inventes resultados.

No ocultes errores.

No elimines código o datos sin justificarlo.

---

# 66. Resumen final obligatorio

Utiliza este formato:

```markdown
# Resumen de la tarea

## Tarea realizada

Descripción breve.

## Archivos creados

- `ruta/archivo`

## Archivos modificados

- `ruta/archivo`

## Cambios principales

- Cambio realizado.

## Skills disponibles revisadas

- `skills/frontend/SKILL.md`

## Skills aplicadas

- `skills/frontend/SKILL.md`: explicación.

## Skills descartadas

- `skills/backend/SKILL.md`: no era aplicable porque...

## Skills creadas o modificadas

- Skill y motivo.
- Evaluación ejecutada.
- Resultado.

## Comprobaciones realizadas

- `npm run lint`
- `npm run typecheck`
- `npm run test`

## Resultados

- Linter: correcto.
- TypeScript: correcto.
- Pruebas: correctas.

## Documentación actualizada

- `ruta/documento`

## Registro y versionado

- `WORK_LOG.md`: actualizado / no actualizado, con motivo.
- `CHANGELOG.md`: actualizado / no actualizado, con motivo.
- `VERSIONING.md`: actualizado / no actualizado, con motivo.
- Versión del proyecto: sin cambios / actualizada de X a Y.

## Limitaciones o riesgos

- Limitación identificada.

## Estado de la tarea

Completada o incompleta.

## Siguiente tarea recomendada

Nombre de la tarea, sin implementarla.
```

No indiques que una comprobación es correcta si no se ejecutó.

---

# 67. Definition of Done

Una tarea solo está terminada cuando:

* Cumple los requisitos.
* Respeta la arquitectura.
* Respeta el dominio.
* TypeScript compila.
* El linter pasa.
* Las pruebas relevantes pasan.
* Los errores están gestionados.
* La interfaz está en español.
* El código está en inglés.
* Es responsive cuando corresponda.
* Es accesible cuando corresponda.
* Está documentada.
* No contiene secretos.
* No añade dependencias innecesarias.
* No deja código muerto.
* No introduce regresiones conocidas.
* Funciona en local.
* No adelanta el despliegue.
* Las skills existentes fueron revisadas.
* Las skills aplicables fueron utilizadas.
* Las skills nuevas están justificadas.
* Las skills creadas o modificadas fueron evaluadas.
* No existen duplicidades injustificadas.
* Se registraron los resultados de las evaluaciones.
* `WORK_LOG.md` fue actualizado.
* `CHANGELOG.md` fue actualizado si hubo cambios relevantes.
* La versión fue actualizada solo si correspondía.
* No se crearon tags ni releases sin permiso.

---

# 68. Alcance del MVP local

La fase local debe terminar con:

* Registro.
* Inicio de sesión.
* Perfil.
* Dimensiones.
* Publicación de objetos.
* Edición.
* Eliminación.
* Imágenes locales.
* Búsqueda.
* Filtros.
* Favoritos.
* Ofertas.
* Contraofertas opcionales.
* Chat.
* Transacciones.
* Valoraciones.
* Notificaciones básicas.
* Moderación básica.
* Diseño responsive.
* Accesibilidad.
* Datos de demostración.
* Tests.
* Documentación.
* Flujo completo funcional en local.

No desarrollar inicialmente:

* Pagos reales.
* Aplicación móvil nativa.
* Microservicios.
* Blockchain.
* Criptomonedas reales.
* IA obligatoria.
* Logística real.
* Multiidioma.
* Recomendaciones avanzadas.

---

# 69. Lista inicial de tareas

Crea `docs/project/TASKS.md`:

```markdown
# Estado del proyecto

Fase activa: Desarrollo local  
Estado: En progreso

# Fase 1: desarrollo local

## Preparación

- [ ] Inspeccionar el repositorio
- [ ] Crear estructura documental
- [ ] Crear AGENTS.md
- [ ] Crear CLAUDE.md
- [ ] Crear WORK_LOG.md
- [ ] Crear CHANGELOG.md
- [ ] Crear VERSIONING.md
- [ ] Definir versión inicial 0.1.0
- [ ] Definir Wormarket como nombre oficial del proyecto
- [ ] Crear ADR del nombre Wormarket
- [ ] Inventariar las skills existentes
- [ ] Auditar íntegramente las skills existentes
- [ ] Crear o adaptar la skill skill-creator
- [ ] Crear SKILLS_CATALOG.md
- [ ] Detectar duplicidades y carencias
- [ ] Completar skills vacías o desactualizadas
- [ ] Evaluar las skills iniciales
- [ ] Documentar qué skills corresponden a cada tarea
- [ ] Definir MVP
- [ ] Definir arquitectura
- [ ] Definir sistema visual
- [ ] Crear ADR iniciales

## Configuración técnica

- [ ] Crear monorepo con npm workspaces
- [ ] Configurar Next.js
- [ ] Configurar NestJS
- [ ] Configurar TypeScript estricto
- [ ] Configurar ESLint y Prettier
- [ ] Configurar PostgreSQL con Docker
- [ ] Configurar Prisma
- [ ] Configurar migraciones
- [ ] Configurar seed
- [ ] Configurar scripts raíz
- [ ] Configurar tests
- [ ] Configurar CI inicial

## Dominio y backend

- [ ] Implementar módulo Dimensions
- [ ] Implementar módulo Users
- [ ] Implementar módulo Identity
- [ ] Implementar módulo Listings
- [ ] Implementar módulo Favorites
- [ ] Implementar módulo Offers
- [ ] Implementar módulo Transactions
- [ ] Implementar módulo Conversations
- [ ] Implementar módulo Reviews
- [ ] Implementar módulo Notifications
- [ ] Implementar módulo Moderation

## Frontend

- [ ] Implementar layout principal
- [ ] Implementar sistema de componentes
- [ ] Implementar autenticación
- [ ] Implementar explorador de anuncios
- [ ] Implementar detalle de anuncio
- [ ] Implementar creación y edición
- [ ] Implementar favoritos
- [ ] Implementar ofertas
- [ ] Implementar chat
- [ ] Implementar perfil
- [ ] Implementar valoraciones
- [ ] Implementar notificaciones
- [ ] Implementar moderación

## Integración y pulido

- [ ] Integrar frontend y backend
- [ ] Implementar almacenamiento local
- [ ] Completar seed visual
- [ ] Añadir pruebas unitarias
- [ ] Añadir pruebas de integración
- [ ] Añadir pruebas end-to-end
- [ ] Revisar responsive
- [ ] Revisar accesibilidad
- [ ] Revisar seguridad
- [ ] Revisar rendimiento
- [ ] Corregir errores
- [ ] Auditar nuevamente todas las skills
- [ ] Actualizar evaluaciones de skills
- [ ] Revisar WORK_LOG.md
- [ ] Revisar CHANGELOG.md
- [ ] Revisar VERSIONING.md
- [ ] Completar documentación
- [ ] Validar flujo completo local
- [ ] Aprobar fase local

# Fase 2: despliegue

Estado: Bloqueada

- [ ] Revisar y evaluar la skill de despliegue
- [ ] Crear proyecto Supabase
- [ ] Configurar PostgreSQL de producción
- [ ] Configurar Cloudinary
- [ ] Implementar adaptador Cloudinary
- [ ] Desplegar backend en Render
- [ ] Desplegar frontend en Vercel
- [ ] Configurar variables de producción
- [ ] Configurar CORS
- [ ] Configurar cookies seguras
- [ ] Validar WebSockets
- [ ] Ejecutar migraciones
- [ ] Cargar datos de demostración
- [ ] Configurar GitHub Actions final
- [ ] Configurar health checks
- [ ] Probar flujo completo
- [ ] Documentar despliegue
- [ ] Cerrar versión 1.0.0
- [ ] Preparar demostración del TFM
```

---

# 70. Cierre de la fase local

La fase local solo puede cerrarse cuando:

* Todas las tareas obligatorias están completas.
* La aplicación funciona desde cero siguiendo el README.
* Docker inicia PostgreSQL.
* Las migraciones funcionan.
* El seed funciona.
* Frontend y backend arrancan.
* El usuario puede registrarse e iniciar sesión.
* Puede publicar y buscar un anuncio.
* Otro usuario puede realizar una oferta.
* El vendedor puede aceptarla.
* Ambos pueden chatear.
* La transacción puede completarse.
* Puede añadirse una valoración.
* Las pruebas esenciales pasan.
* No hay errores críticos conocidos.
* El diseño está pulido.
* La aplicación es responsive.
* Se revisó la accesibilidad.
* Se revisó la seguridad.
* La documentación está actualizada.
* Todas las skills fueron auditadas.
* Las skills reflejan los procedimientos reales.
* Las skills importantes tienen evaluaciones.
* No existen conflictos conocidos entre skills y `AGENTS.md`.
* `WORK_LOG.md` refleja el trabajo realizado.
* `CHANGELOG.md` está actualizado.
* `VERSIONING.md` está actualizado.
* La versión local final está definida.
* El nombre Wormarket está aplicado de forma consistente en documentación, código, variables y ejemplos.

Solo después podrá cambiarse:

```text
Fase activa: Desarrollo local
```

por:

```text
Fase activa: Despliegue
```

---

# 71. Primera tarea

Realiza únicamente lo siguiente:

1. Inspecciona el repositorio.
2. Informa de los archivos y carpetas existentes.
3. Propón la estructura definitiva.
4. Aplica **Wormarket** como nombre oficial del proyecto.
5. Sustituye referencias antiguas al concepto anterior por **Wormarket**, salvo cuando se documenten decisiones históricas.
6. Localiza todas las skills existentes.
7. Lee íntegramente cada `SKILL.md`.
8. Revisa sus archivos auxiliares.
9. Crea un inventario de skills.
10. Identifica:

    * skills válidas;
    * skills incompletas;
    * skills duplicadas;
    * skills desactualizadas;
    * skills demasiado amplias;
    * skills demasiado específicas;
    * carencias reales.
11. No elimines ni reemplaces skills sin justificarlo.
12. Crea o adapta `skills/skill-creator/SKILL.md`.
13. Basa su metodología en:

    * captura de intención;
    * redacción inicial;
    * creación de casos de prueba;
    * evaluación con y sin skill;
    * revisión cualitativa;
    * métricas cuando estén disponibles;
    * mejora de la descripción;
    * iteración;
    * ampliación progresiva de pruebas.
14. Crea o actualiza:

    * `AGENTS.md`
    * `CLAUDE.md`
    * `README.md`
    * `.gitignore`
    * `.env.example`
    * `docs/project/MASTER_PROMPT.md`
    * `docs/project/LOCAL_DEVELOPMENT_PLAN.md`
    * `docs/project/DEPLOYMENT_PLAN.md`
    * `docs/project/TASKS.md`
    * `docs/project/MVP.md`
    * `docs/project/ROADMAP.md`
    * `docs/project/SKILLS_CATALOG.md`
    * `docs/project/WORK_LOG.md`
    * `docs/project/CHANGELOG.md`
    * `docs/project/VERSIONING.md`
    * `docs/architecture/ARCHITECTURE.md`
    * `docs/architecture/MODULES.md`
    * `docs/design/VISUAL_DIRECTION.md`
    * `docs/design/DESIGN_SYSTEM.md`
    * `docs/decisions/0004-use-wormarket-as-product-name.md`
15. Crea o completa, solo cuando sea necesario:

    * `skills/frontend/SKILL.md`
    * `skills/backend/SKILL.md`
    * `skills/database/SKILL.md`
    * `skills/testing/SKILL.md`
    * `skills/design-system/SKILL.md`
    * `skills/accessibility/SKILL.md`
    * `skills/security/SKILL.md`
    * `skills/deployment/SKILL.md`
16. No sobrescribas una skill existente correctamente diseñada.
17. Crea casos positivos, negativos y ambiguos para las skills principales.
18. Evalúa al menos las skills creadas o modificadas sustancialmente.
19. Registra los resultados sin inventar métricas.
20. Documenta qué skill corresponde a cada tipo de tarea.
21. Documenta la procedencia de skills externas.
22. Crea `WORK_LOG.md` con su estructura inicial.
23. Registra la primera entrada en `WORK_LOG.md`.
24. Crea `CHANGELOG.md` con sección `[Unreleased]`.
25. Crea `VERSIONING.md` con reglas SemVer adaptadas.
26. Define la versión inicial como `0.1.0`.
27. Añade `"name": "wormarket"` y `"version": "0.1.0"` al `package.json` raíz si existe o cuando se cree.
28. Registra los cambios iniciales en `[Unreleased]` o en la versión inicial `0.1.0`, según el estado real del repositorio.
29. No ejecutes scripts externos no revisados.
30. No implementes funcionalidades del marketplace.
31. No instales dependencias sin justificarlo.
32. No configures servicios de producción.
33. No realices despliegues.
34. No crees tags de Git ni releases.
35. Al terminar, muestra:

    * archivos creados;
    * archivos modificados;
    * referencias renombradas a Wormarket;
    * skills encontradas;
    * skills revisadas;
    * skills creadas;
    * skills modificadas;
    * skills descartadas;
    * evaluaciones realizadas;
    * resultados de evaluaciones;
    * conflictos detectados;
    * decisiones tomadas;
    * comprobaciones ejecutadas;
    * estado de `WORK_LOG.md`;
    * estado de `CHANGELOG.md`;
    * estado de `VERSIONING.md`;
    * versión actual del proyecto;
    * dudas o riesgos;
    * siguiente tarea recomendada.
36. No avances a la siguiente tarea.

Trabaja con cambios pequeños, coherentes, seguros y verificables.
