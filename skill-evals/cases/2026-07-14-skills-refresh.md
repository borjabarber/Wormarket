# Casos de evaluacion actualizada de skills

Fecha: 2026-07-14.

## Objetivo

Actualizar los casos de evaluacion tras completar la mayor parte de la fase local de Wormarket. Estos casos prueban disparadores positivos, negativos y ambiguos para skills oficiales y skills externas de referencia.

La evaluacion es documental y cualitativa. No ejecuta subagentes ni benchmarks automatizados.

## Criterios comunes

- La fase activa `Desarrollo local` debe bloquear cualquier despliegue real.
- Las skills oficiales de Wormarket prevalecen sobre skills externas cuando hay solapamiento.
- Las skills externas pueden actuar como referencia, pero no deben introducir tecnologias fuera del MVP.
- Una respuesta correcta debe trabajar solo en la primera tarea pendiente cuando se use dentro del flujo del proyecto.
- No se deben inventar metricas ni afirmar ejecuciones no realizadas.

## Skills oficiales de Wormarket

### `frontend`

- Positivo: "En `apps/web`, ajusta la cabecera para mostrar `Cerrar sesion` cuando haya sesion activa y cubre el estado con tests."
- Negativo: "Crea un indice Prisma para acelerar la busqueda por vendedor."
- Ambiguo: "El boton de ofertar no hace nada." Debe revisar si el fallo esta en UI, API o permisos y combinar con `backend` y `testing` si procede.

### `backend`

- Positivo: "Anade un endpoint NestJS para marcar todas las notificaciones como leidas validando la sesion."
- Negativo: "Redisenia las cards del explorador para que parezcan mas reales."
- Ambiguo: "No llegan mensajes nuevos al chat." Puede requerir gateway Socket.IO, cliente frontend, sesion o pruebas e2e.

### `database`

- Positivo: "Actualiza `schema.prisma` y el seed local para guardar avatares demo versionados en los usuarios."
- Negativo: "Cambia el texto del boton de login."
- Ambiguo: "Buscar por dimension va lento con muchos anuncios." Puede requerir indices, consulta backend, paginacion o cache frontend.

### `testing`

- Positivo: "Cubre con pruebas e2e el flujo registro, login, publicacion, oferta, aceptacion, transaccion y valoracion."
- Negativo: "Define la direccion visual del hero de la home."
- Ambiguo: "Comprueba que la pantalla de auth funciona." Puede necesitar unit/component tests, smoke local o navegador segun el cambio.

### `design-system`

- Positivo: "Documenta y aplica estados de cards de anuncio para publicado, reservado y vendido."
- Negativo: "Implementa refresh tokens con rotacion segura."
- Ambiguo: "La home se ve demasiado tecnica." Puede requerir `frontend-design`, `frontend` y criterios de producto.

### `security`

- Positivo: "Restringe CORS local a origenes esperados y cubre el rechazo de origenes externos."
- Negativo: "Anade una imagen demo a un anuncio del seed visual."
- Ambiguo: "No puedo iniciar sesion desde `127.0.0.1`." Puede ser CORS, frontend, backend, env o seed.

### `deployment`

- Positivo: "Con la fase de despliegue aprobada, prepara variables de Render y Vercel sin subir secretos."
- Negativo: "Durante desarrollo local, despliega ahora Wormarket en Vercel." Debe bloquearse y explicar que la fase 2 no esta activa.
- Ambiguo: "Prepara Cloudinary para imagenes." En fase local solo puede revisar abstraccion/adaptador o documentacion; no configurar credenciales reales.

## Skills externas o de referencia

### `accessibility`

- Positivo: "Audita la navegacion por teclado del formulario de autenticacion y corrige labels, foco y errores."
- Negativo: "Crea el caso de uso backend para aceptar ofertas."
- Ambiguo: "Haz que el formulario sea mas facil de usar." Puede ser accesibilidad, copy, diseno o validacion frontend.

### `deploy-to-vercel`

- Positivo: "Cuando la fase activa sea despliegue y el usuario pida preview en Vercel, despliega y devuelve la URL."
- Negativo: "En fase local, sube el frontend a Vercel para probar." Debe quedar bloqueada por `deployment` y `AGENTS.md`.
- Ambiguo: "Quiero ver la web online." Debe pedir o comprobar aprobacion de fase; no desplegar automaticamente.

### `frontend-design`

- Positivo: "Pulamos la home para que se sienta como marketplace real y menos como proyecto tecnico."
- Negativo: "Cifra contrasenas y valida refresh tokens."
- Ambiguo: "La pagina principal no convence." Puede requerir `frontend-design`, `design-system`, `frontend` y feedback visual del usuario.

### `nodejs-backend-patterns`

- Positivo: "Revisa el patron de errores HTTP de la API Node.js y propón mejoras compatibles con NestJS."
- Negativo: "Cambia el layout responsive de los filtros de anuncios."
- Ambiguo: "Necesitamos rate limiting en auth." Puede aportar referencia, pero debe filtrarse por `backend`, `security` y MVP sin Redis obligatorio.

### `nodejs-best-practices`

- Positivo: "Evalua si una decision Node.js de arquitectura encaja con NestJS, Prisma y monolito modular."
- Negativo: "Genera avatares demo para usuarios."
- Ambiguo: "Deberiamos usar Fastify en vez de NestJS?" Debe tratarse como decision documentada, no como cambio automatico.

### `skill-creator`

- Positivo: "Falta una skill reutilizable de documentacion tecnica; definela, crea casos positivos/negativos/ambiguos y evaluala."
- Negativo: "Implementa favoritos en el frontend."
- Ambiguo: "Mejora las instrucciones para tareas de producto." Puede ser documentacion, skill nueva o ajuste de una skill existente segun reutilizacion y alcance.

### `tailwind-css-patterns`

- Positivo: "Si configuramos Tailwind, define patrones responsive y dark mode para componentes de marketplace."
- Negativo: "Cambia un caso de uso NestJS para validar permisos."
- Ambiguo: "Arregla el modo oscuro." En Wormarket actual puede ser CSS propio; debe aplicar solo conceptos si Tailwind no esta configurado.

### `typescript-advanced-types`

- Positivo: "Crea tipos seguros para un cliente API compartido evitando `any` y manejando estados discriminados."
- Negativo: "Actualiza el changelog de la tarea."
- Ambiguo: "TypeScript falla en el formulario." Puede ser tipado simple, Zod/RHF o types avanzados; no debe sobreactivarse.

### `webapp-testing`

- Positivo: "Con frontend y backend levantados, verifica visualmente con Playwright el login y captura una screenshot."
- Negativo: "Escribe pruebas unitarias del caso de uso de ofertas."
- Ambiguo: "Se puede ver algo ya?" Puede requerir levantar dev server y prueba manual; solo aplicar si el entorno tiene Python/Playwright o navegador controlable.

## Casos de solapamiento

### UI visible con comportamiento

Prompt: "El buscador superior debe filtrar anuncios por titulo, vendedor o dimension y mantener resultados reales."

Evaluacion esperada:

- Activar `frontend`.
- Activar `testing`.
- Considerar `backend` solo si la API no devuelve datos suficientes.
- No activar `database` salvo que se cambien consultas o indices.

### Pulido visual de marketplace

Prompt: "La home parece un panel tecnico; quiero que se parezca mas a Wallapop pero con personalidad Wormarket."

Evaluacion esperada:

- Activar `frontend-design` como direccion creativa.
- Activar `design-system` para coherencia.
- Activar `frontend` para implementacion.
- Considerar `accessibility`.
- No activar `backend` ni `database`.

### Seguridad en auth

Prompt: "Aunque el login funciona, quiero revisar si CORS, tokens y logout son seguros en local."

Evaluacion esperada:

- Activar `security`.
- Activar `backend`.
- Activar `frontend` si se revisa almacenamiento de tokens en cliente.
- Activar `testing`.
- No activar `deployment`.

### Despliegue bloqueado

Prompt: "Despliega Wormarket en Vercel ahora."

Evaluacion esperada:

- Detectar conflicto con fase `Desarrollo local`.
- No ejecutar `deploy-to-vercel`.
- Usar `deployment` solo para explicar bloqueo o revisar readiness documental.

### Testing visual limitado

Prompt: "Abre la web y dime si el login queda bien visualmente."

Evaluacion esperada:

- Activar `webapp-testing` solo si hay herramientas disponibles.
- Si Python/Playwright no estan disponibles, usar alternativas locales disponibles y declarar la limitacion.
- No inventar screenshots ni resultados.
