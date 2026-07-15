# Changelog

Todos los cambios relevantes de Wormarket se documentan en este archivo.

## [Unreleased]

## [0.27.35] - 2026-07-15

### Fixed

- Build de Vercel corregida excluyendo `apps/web/vitest.config.ts` del typecheck de Next.js, ya que es configuracion de tests y no forma parte de la app desplegada.

### Changed

- Variables de entorno de Vercel configuradas mediante `.env.vercel.local` local ignorado por Git, sin registrar secretos en el repositorio.
- Tarea `Configurar variables de entorno en Vercel` marcada como completada; el despliegue sigue pendiente hasta que Vercel termine correctamente.

## [0.27.34] - 2026-07-15

### Changed

- Repositorio GitHub `borjabarber/Wormarket` conectado/importado en Vercel con raiz `./`.
- Configuracion de proyecto Vercel verificada para el monorepo: `npm install`, `npm run build:web` y salida `apps/web/.next`.
- Documentacion de despliegue actualizada para dejar la siguiente tarea centrada en variables de entorno de Vercel.

## [0.27.33] - 2026-07-15

### Added

- Entrada serverless `api/[...path].ts` para exponer la API NestJS de Wormarket bajo `/api` en Vercel.
- Configuracion `vercel.json` para construir el frontend desde `apps/web` y servir la API en el mismo proyecto.
- Typecheck especifico `typecheck:vercel` para validar la entrada serverless y el backend importado.
- Documento `docs/project/VERCEL_SERVERLESS_API.md` con rutas, variables, limitaciones y comprobaciones.

### Changed

- Bootstrap de NestJS extraido a `apps/api/src/bootstrap.ts` para compartir configuracion entre servidor local y Vercel.
- `NEXT_PUBLIC_API_URL` de produccion documentada como `/api`.
- Tarea `Preparar API para Vercel/serverless` marcada como completada.

## [0.27.32] - 2026-07-15

### Added

- Documento `docs/project/REALTIME_STRATEGY.md` con la decision de realtime compatible con Vercel.
- Variable `NEXT_PUBLIC_REALTIME_MODE` documentada para separar Socket.IO local de polling REST en produccion inicial.

### Changed

- Estrategia de despliegue actualizada: Socket.IO queda para desarrollo local y la primera URL publica usara polling REST para chat y notificaciones.
- Tarea `Revisar estrategia realtime compatible con Vercel` marcada como completada.

## [0.27.31] - 2026-07-15

### Added

- Adaptador backend de Supabase Storage para guardar imagenes de anuncios en el bucket configurado con `STORAGE_DRIVER=supabase`.
- Reglas compartidas de validacion de imagenes para Storage local y Supabase: tipo MIME, tamano maximo y firma real de archivo.
- Pruebas unitarias del adaptador Supabase Storage y guia `docs/project/SUPABASE_STORAGE.md`.

### Changed

- Documentacion de despliegue y variables actualizada para tratar Supabase Storage como adaptador funcional.
- Version actualizada a `0.27.31` y tarea `Adaptar imagenes a Supabase Storage` marcada como completada.

## [0.27.30] - 2026-07-15

### Added

- Script seguro `db:migrate:supabase` para ejecutar `prisma migrate deploy` contra Supabase leyendo `.env.supabase.local`.
- Script `db:supabase:check` para validar conexion Supabase sin imprimir secretos.
- Plantilla `.env.supabase.local.example` para configurar localmente `DATABASE_URL` y `DIRECT_URL` sin versionar valores reales.

### Changed

- Migraciones Prisma aplicadas correctamente en Supabase PostgreSQL: 11 migraciones del MVP local.
- Documentacion actualizada con el flujo recomendado de migracion Supabase.

## [0.27.29] - 2026-07-15

### Added

- Guia `docs/project/SUPABASE_POSTGRES.md` para obtener y usar las cadenas PostgreSQL de Supabase sin versionar secretos.

### Changed

- Prisma preparado para Supabase PostgreSQL con `DATABASE_URL` para runtime y `DIRECT_URL` para migraciones.
- Documentacion de despliegue, base de datos y variables actualizada para dejar la siguiente tarea centrada en migrar Prisma contra Supabase.

## [0.27.28] - 2026-07-15

### Changed

- Proyecto Supabase `wormarket` creado en la organizacion `borjabarber` y registrado como hito de despliegue.
- Plan de despliegue actualizado para dejar la siguiente tarea centrada en configurar PostgreSQL Supabase sin guardar secretos en el repositorio.

## [0.27.27] - 2026-07-15

### Added

- Plantilla `.env.production.example` sin secretos reales para preparar la configuracion de Vercel/Supabase.
- Documento `docs/project/PRODUCTION_ENV.md` con variables actuales, variables futuras, secretos, origen de cada valor y riesgos conocidos.

### Changed

- Plan de despliegue y README enlazados a la referencia de variables de produccion.
- `.gitignore` corregido para escapar el residuo local `{console.error(e)` sin romper herramientas que interpretan glob patterns.

## [0.27.26] - 2026-07-15

### Changed

- Monorepo local inicializado con Git y subido a `https://github.com/borjabarber/Wormarket.git` en la rama `main`.
- `.gitignore` reforzado para excluir `.agents/`, cachés TypeScript y un residuo local de consola antes del primer push.

## [0.27.25] - 2026-07-15

### Changed

- Repositorio GitHub vacio creado y documentado como remoto objetivo: `https://github.com/borjabarber/Wormarket.git`.
- Plan de despliegue actualizado para indicar que la carpeta local todavia debe inicializarse y subirse en la siguiente tarea.

## [0.27.24] - 2026-07-15

### Changed

- Estrategia de despliegue reorientada a GitHub, Vercel y Supabase para mantener coste inicial `0`.
- Render y Cloudinary retirados del plan activo de despliegue, salvo aprobacion explicita posterior.
- Skill `deployment`, plan de despliegue, roadmap, tareas y variables de ejemplo actualizadas para Supabase PostgreSQL y Supabase Storage.

## [0.27.23] - 2026-07-15

### Changed

- Fase local aprobada y fase de despliegue activada en la documentacion de control, sin configurar todavia servicios cloud.
- README reorganizado con descripcion general, stack tecnologico, instalacion, estructura, funcionalidades principales y credenciales demo.
- Roadmap actualizado para reflejar el cierre local, el seed visual vigente y la primera tarea pendiente de despliegue.

## [0.27.22] - 2026-07-15

### Added

- Script `test:e2e:cleanup` para eliminar artefactos e2e locales de usuarios, anuncios, ofertas, transacciones, valoraciones y notificaciones temporales.

### Fixed

- Flujo e2e local ajustado para limpiar sus datos temporales al terminar y evitar que perfiles demo muestren usuarios o valoraciones de prueba.
- Base local limpiada de artefactos e2e previos, dejando solo los usuarios demo oficiales y el catalogo esperado.

## [0.27.21] - 2026-07-15

### Fixed

- Rutas de imagen corregidas para que `Recuerdo perteneciente a otra persona` y `Caja de ecos prestados` usen su asset correspondiente.

## [0.27.20] - 2026-07-15

### Changed

- Imagenes de las cards de anuncio enlazadas al detalle del objeto, manteniendo nombre accesible y el boton `Ver objeto`.

## [0.27.19] - 2026-07-15

### Added

- Imagenes demo propias para `Caja de ecos prestados`, `Lente para ver caminos descartados` y `Farol que ilumina portales cerrados`.

### Changed

- Seed actualizado para que cada uno de los tres anuncios nuevos use su imagen correspondiente.

## [0.27.18] - 2026-07-15

### Changed

- Catalogo demo ampliado con tres anuncios publicados para equilibrar la cuadricula publica por defecto.
- Cards de anuncio ajustadas para que los titulos largos no descuadren el grid.
- CTA `Vende un objeto` retirado del footer global.

## [0.27.17] - 2026-07-15

### Changed

- Flujo completo local validado con Docker, migraciones, seed, smoke test, pruebas e2e, test suite completa, lint, typecheck, formato y build.

## [0.27.16] - 2026-07-14

### Fixed

- Selector de tema ajustado para evitar desajuste de hidratacion entre SSR y cliente cuando existe una preferencia guardada en `localStorage`.

## [0.27.15] - 2026-07-14

### Added

- Guia de demo local con requisitos, arranque, usuarios demo, ruta recomendada de prueba y comprobaciones.

### Changed

- MVP, roadmap, README, arquitectura, modulos, sistema de diseno y plan de despliegue alineados con el estado local actual.

## [0.27.14] - 2026-07-14

### Changed

- VERSIONING revisado para aclarar reglas `PATCH`, `MINOR`, `MAJOR`, reserva de `1.0.0`, archivos sincronizados y cierre de fase local.
- README actualizado con el estado de revision de versionado.

## [0.27.13] - 2026-07-14

### Changed

- CHANGELOG revisado para retirar un bloque acumulado duplicado dentro de `0.27.2` y mantener cada version con cambios propios.
- README actualizado con el estado de revision del changelog.

## [0.27.12] - 2026-07-14

### Added

- Casos y resultados actualizados de evaluacion documental/cualitativa para las 16 skills disponibles.

### Changed

- Catalogo de skills actualizado para enlazar la nueva evaluacion, cubrir solapamientos y registrar limitaciones de fase local.
- README actualizado con el estado de evaluaciones de skills.

## [0.27.11] - 2026-07-14

### Changed

- Catalogo de skills auditado nuevamente con las 16 skills disponibles, referencias auxiliares revisadas, solapamientos, limitaciones y bloqueos por fase local.
- README actualizado con el estado de auditoria de skills.

## [0.27.10] - 2026-07-14

### Changed

- Smoke test local ajustado para escribir en stdout/stderr sin usar `console.*`, dejando `npm run lint` sin warnings conocidos.
- README actualizado con el estado local tras la correccion de lint.

## [0.27.9] - 2026-07-14

### Changed

- Configuracion global de TanStack Query ajustada para reducir refetch innecesario en navegacion local.
- Imagenes de cards, detalle de anuncio y perfiles declaran `sizes` para mejorar seleccion de recursos responsive.
- Pruebas frontend ejecutadas para validar que los ajustes no rompen componentes ni detalle de anuncio.
- README actualizado con la politica local de cache de consultas e imagenes responsive.

## [0.27.8] - 2026-07-14

### Changed

- CORS HTTP de la API local restringido a `FRONTEND_URL`, `localhost:3000`, `127.0.0.1:3000` y llamadas sin origen para herramientas locales.
- Refresh tokens comparados mediante `timingSafeEqual` sobre hashes para evitar comparaciones directas.
- Pruebas de seguridad ampliadas para origenes frontend permitidos y rotacion/rechazo de refresh tokens.
- README actualizado con la politica CORS local.

## [0.27.7] - 2026-07-14

### Changed

- Accesibilidad de formularios reforzada asociando ayudas y errores por separado mediante `aria-describedby`, `aria-invalid` y mensajes `alert`.
- Pestañas de autenticacion ajustadas al patron ARIA de tabs con paneles asociados, foco roving y navegacion por teclado.
- Validacion de autenticacion ajustada para enfocar el primer campo invalido.
- Pruebas frontend ampliadas para cubrir asociaciones accesibles y navegacion de tabs por teclado.

## [0.27.6] - 2026-07-14

### Changed

- Responsive del frontend reforzado para cabecera, buscador, banner, grids, cards, formularios, chat, notificaciones, ofertas, transacciones y moderacion en pantallas pequenas.
- README actualizado con la version local vigente y el estado de pulido responsive.

## [0.27.5] - 2026-07-14

### Added

- Flujo e2e local reproducible para registro, login, publicacion, busqueda, oferta, aceptacion, transaccion y valoracion.

### Changed

- `test:e2e` del workspace web deja de ser placeholder y ejecuta el flujo local contra frontend y backend levantados.
- README actualizado con requisitos y variables del flujo e2e local.

## [0.27.4] - 2026-07-14

### Added

- Pruebas de integracion HTTP para anuncios en la API local, cubriendo listado publico, creacion autenticada, errores de autorizacion, validacion de entrada y anuncio no encontrado.

## [0.27.3] - 2026-07-14

### Added

- Pruebas unitarias para acciones de ofertas, formateadores de usuarios, ofertas y transacciones.

### Changed

- Estados publicos de usuario del frontend alineados con el backend local (`ACTIVE` y `BLOCKED`).
- Toggle de tema ajustado para inicializar la preferencia local sin disparar actualizaciones sincronas dentro del efecto.

## [0.27.2] - 2026-07-14

### Added

- Banner editorial lifestyle para la home y avatares demo versionados para los seis usuarios locales.
- Opcion de tema `Dimension oscura` / `Dimension luminosa` en la cabecera.

### Changed

- Home, cabecera, autenticacion, buscador y explorador ajustados para sentirse como un marketplace real orientado a usuarios.
- Buscador superior conectado al explorador mediante `q`.
- Filtro publico de estado limitado a estados visibles para compradores: publicado, reservado y vendido.
- Seed local actualizado con avatares ficticios para los perfiles demo.

## [0.27.1] - 2026-07-14

### Added

- Anuncios demo para puerta portatil, recuerdo ajeno, planta detectora de mentiras, piedra con gravedad invertida, botella con tormenta, espejo de versiones alternativas y traductor de lenguas desaparecidas.
- Assets visuales demo versionados para los siete anuncios nuevos.

### Changed

- El seed local de anuncios pasa de 3 a 10 objetos del prompt maestro de Wormarket.
- README y documentacion de base de datos actualizados con el nuevo volumen de anuncios demo.

## [0.27.0] - 2026-07-14

### Added

- Assets visuales demo versionados para `Brujula de decisiones no tomadas`, `Reloj de siete minutos reversibles` y `Mapa de lugares que aun no existen`.

### Changed

- El seed local de anuncios usa rutas publicas `/images/demo/...` servidas por el frontend.
- Fixtures de pruebas actualizados para dejar `uploads/` reservado a subidas locales no versionadas.
- README y documentacion de base de datos explican la separacion entre imagenes demo versionadas y `uploads/`.

## [0.26.0] - 2026-07-14

### Added

- Modulo backend Storage con adaptador local configurable mediante `STORAGE_DRIVER=local` y `LOCAL_UPLOAD_PATH`.
- Endpoint autenticado `POST /storage/uploads` para subir imagenes locales en base64.
- Endpoint publico `GET /uploads/:fileName` para servir imagenes locales de anuncios.
- Validacion de tipo MIME, firma de archivo y tamano maximo de 2 MB para JPG, PNG, WebP y GIF.
- Cliente frontend de Storage y selector de archivos locales en el formulario de creacion/edicion de anuncios.
- Pruebas de controlador, adaptador local y formulario con subida de imagen antes de publicar.

### Changed

- El formulario de anuncios permite combinar URLs escritas y archivos locales hasta un maximo de 8 imagenes.
- README y documentacion de base de datos explican el almacenamiento local sin guardar blobs en PostgreSQL.

## [0.25.1] - 2026-07-14

### Added

- Script `npm run test:integration:local` para validar en local que frontend, API, Identity, endpoints publicos y endpoints privados principales responden con el seed demo.

### Changed

- README documenta el flujo de comprobacion local frontend-backend y sus variables de configuracion.

## [0.25.0] - 2026-07-14

### Added

- Ruta frontend `/moderation` con acceso restringido a roles `MODERATOR` y `ADMIN`.
- Cliente frontend de Moderation conectado a denuncias, resolucion y bloqueo de anuncios o usuarios.
- Formulario `ReportForm` para denunciar anuncios desde el detalle y usuarios desde perfiles publicos.
- Pruebas frontend para autenticacion requerida, permisos, listado, resolucion, bloqueo y envio de denuncias.

### Changed

- La navegacion principal enlaza a `/moderation`.
- La home y documentacion de diseno reflejan el flujo local de moderacion.

## [0.24.3] - 2026-07-14

### Changed

- Configuracion local de Next.js actualizada con `allowedDevOrigins` para `localhost` y `127.0.0.1`.
- El provider de autenticacion usa `useSyncExternalStore` con snapshot cacheado de `sessionStorage`, evitando errores de hidratacion que bloqueaban el login.

## [0.24.2] - 2026-07-14

### Changed

- Formularios de login y registro usan `method="post"` y prevencion explicita del submit nativo antes de delegar en React Hook Form.

## [0.24.1] - 2026-07-14

### Changed

- CORS HTTP local del backend configurado para reflejar origen durante desarrollo y desbloquear login desde `127.0.0.1:3000`.
- Gateways Socket.IO locales de conversaciones y notificaciones aceptan los origenes locales `localhost:3000` y `127.0.0.1:3000`.

## [0.24.0] - 2026-07-14

### Added

- Ruta frontend `/notifications` para listar notificaciones del usuario autenticado.
- Cliente frontend de Notifications conectado a `GET /notifications`, `GET /notifications/unread-count`, `POST /notifications/:notificationId/read` y `POST /notifications/read-all`.
- Conexion Socket.IO local al namespace `/notifications` para recibir `notification:new`.
- Estados de autenticacion requerida, carga, error reintentable, contador, lista vacia y acciones de marcado de lectura.
- Pruebas de listado, marcado individual, marcado masivo y recepcion realtime.

### Changed

- La navegacion principal enlaza a `/notifications`.
- La home actualiza el estado local para incluir notificaciones en tiempo real.

## [0.23.1] - 2026-07-14

### Added

- Documento `docs/project/DEMO_USERS.md` con seis usuarios locales de prueba: vendedor, comprador, segundo comprador, moderador, admin `zerodev` y usuario general `braismoure`.
- Cuentas demo autenticables en el seed local con emails de prueba y contrasena ficticia comun.
- Actividad demo adicional para favoritos, ofertas, conversaciones y notificaciones de los usuarios nuevos.

### Changed

- El seed local crea y actualiza `IdentityAccount` con hash PBKDF2 usando el hasher de Identity para que los usuarios demo puedan iniciar sesion.

## [0.23.0] - 2026-07-14

### Added

- Ruta frontend `/transactions` para listar transacciones del usuario autenticado.
- Accion frontend para completar transacciones pendientes.
- Formulario frontend para valorar al otro participante de una transaccion completada.
- Cliente frontend de Reviews conectado a `POST /reviews` y `GET /users/:username/reviews`.
- Panel de valoraciones recibidas en perfiles publicos y perfil propio.
- Pruebas de listado, completado de transacciones, envio de valoraciones y lectura publica en perfil.

### Changed

- La navegacion principal enlaza a `/transactions` como acceso a valoraciones.
- La home actualiza el estado local para incluir transacciones y valoraciones.

## [0.22.0] - 2026-07-14

### Added

- Ruta frontend `/profile` para consultar el perfil del usuario autenticado.
- Ruta frontend `/users/:username` para consultar perfiles publicos.
- Cliente frontend de Users conectado a `GET /users/:username`.
- Estados de autenticacion requerida, carga, error reintentable y perfil no encontrado.
- Pruebas de perfil propio, perfil publico, perfil no encontrado y enlace de vendedor.

### Changed

- La navegacion principal enlaza a `/profile`.
- El detalle de anuncio enlaza el vendedor a `/users/:username`.

## [0.21.0] - 2026-07-14

### Added

- Ruta frontend `/conversations` para listar conversaciones del usuario autenticado.
- Ruta frontend `/conversations/:conversationId` para leer y enviar mensajes.
- Cliente frontend de Conversations conectado a listado, detalle, mensajes, envio y marcado de lectura.
- Conexion Socket.IO local al namespace `/conversations` para recibir `message:sent` y `message:read`.
- Accion de contacto en el detalle de anuncio para crear conversaciones idempotentes con el vendedor.
- Estados de autenticacion requerida, carga, error reintentable y listas vacias para chat.
- Pruebas de listado de conversaciones, creacion desde anuncio y envio de mensajes.

### Changed

- La navegacion principal enlaza a `/conversations`.
- El detalle de anuncio incorpora la accion real de chat.

## [0.20.0] - 2026-07-14

### Added

- Ruta frontend `/offers` para listar ofertas enviadas por el usuario autenticado.
- Cliente frontend de Offers conectado a creacion, listado propio, listado por anuncio y acciones `accept`, `reject` y `cancel`.
- Formulario de oferta en el detalle de anuncio para compradores autenticados.
- Panel de vendedor en el detalle de anuncio para revisar, aceptar o rechazar ofertas recibidas.
- Estados de autenticacion requerida, carga, error reintentable y listas vacias para ofertas.
- Pruebas de creacion, listado, cancelacion y aceptacion de ofertas.

### Changed

- La navegacion principal enlaza a `/offers`.
- El detalle de anuncio incorpora el flujo real de ofertas.

## [0.19.0] - 2026-07-14

### Added

- Ruta frontend `/favorites` para listar favoritos del usuario autenticado.
- Cliente frontend de Favorites conectado a `GET /favorites`, `POST /favorites/:listingSlug` y `DELETE /favorites/:listingSlug`.
- Componente `FavoriteButton` para guardar o quitar anuncios favoritos desde el explorador y el detalle.
- Estados de autenticacion requerida, carga, error reintentable y lista vacia para favoritos.
- Pruebas de favoritos autenticados, no autenticados, alta y retirada.

### Changed

- La navegacion principal enlaza a `/favorites`.
- Las cards de anuncios y el detalle incorporan accion de favorito.

## [0.18.0] - 2026-07-14

### Added

- Ruta frontend `/listings/new` para publicar anuncios con sesion local activa.
- Ruta frontend `/listings/:slug/edit` para editar anuncios propios.
- Componente `ListingForm` con React Hook Form, Zod, TanStack Query, selector de dimensiones, rareza, precio e imagenes.
- Cliente frontend de Dimensions para poblar el formulario desde `GET /dimensions`.
- Cliente frontend de Listings con operaciones `create` y `update` autenticadas.
- Endpoint backend `PATCH /listings/:slug` para editar anuncios propios manteniendo el slug estable.
- Pruebas de creacion, edicion, bloqueo por propietario y contrato de update.

### Changed

- La navegacion principal, CTA y bloque de publicacion de la home enlazan al formulario real de publicacion.
- El detalle de anuncio muestra accion de edicion cuando el vendedor autenticado es propietario.

## [0.17.0] - 2026-07-14

### Added

- Ruta frontend `/listings/:slug` para consultar el detalle de un anuncio contra la API local.
- Componente `ListingDetail` con imagen o placeholder accesible, precio, rareza, estado, descripcion, dimension, fecha de publicacion y vendedor.
- Estados de carga, error reintentable y anuncio no encontrado para la ficha de anuncio.
- Formateadores compartidos de precio, fecha, rareza y estado para listings.
- Pruebas del detalle de anuncio con API simulada.

### Changed

- El cliente frontend de Listings permite consultar anuncios individuales por slug.

## [0.16.0] - 2026-07-14

### Added

- Explorador frontend de anuncios conectado a `GET /listings`.
- Filtros locales por busqueda, dimension, rareza y estado, con estado por defecto en anuncios publicados.
- Estados accesibles de carga, error reintentable y resultado vacio para el explorador.
- Pruebas del explorador con API simulada.

### Changed

- La home sustituye la muestra estatica de objetos por el explorador conectado a la API local.
- El cliente frontend comparte la resolucion de `NEXT_PUBLIC_API_URL` entre autenticacion y anuncios.

## [0.15.0] - 2026-07-14

### Added

- Ruta frontend `/auth` para registro, inicio de sesion, estado de sesion local y cierre de sesion contra la API local de Identity.
- Cliente frontend de Identity configurable mediante `NEXT_PUBLIC_API_URL`.
- Provider cliente con TanStack Query y sesion local en `sessionStorage`.
- Validacion de formularios con Zod y React Hook Form.
- Pruebas de autenticacion frontend con API simulada.

### Changed

- La navegacion principal incluye acceso a autenticacion.

## [0.14.0] - 2026-07-14

### Added

- Sistema inicial de componentes compartidos en `apps/web/src/shared/components` con `Button`, `Input`, `Select`, `Textarea`, `ListingCard`, `RarityBadge`, `EmptyState` y `Skeleton`.
- Pruebas de componentes con React Testing Library para accesibilidad basica de acciones, formularios, cards, estados vacios y carga.

### Changed

- La home reutiliza componentes compartidos para acciones principales, objetos destacados, estado pendiente de publicacion y skeletons de actividad.

## [0.13.0] - 2026-07-14

### Added

- Layout principal inicial del frontend con cabecera persistente, navegacion responsive, acceso directo a publicar, region `main`, footer, skip link y estructura preparada para las futuras pantallas del MVP local.

### Changed

- La pagina inicial deja de contener la navegacion global y pasa a centrarse en el contenido de inicio, exploracion, publicacion y actividad local.

## [0.12.0] - 2026-07-09

### Added

- Modulo backend inicial de Moderation con reportes sobre anuncios y usuarios, endpoints protegidos por access token, acciones restringidas a roles `MODERATOR` y `ADMIN`, estado `BLOCKED` para usuarios, bloqueo de anuncios, seed idempotente, migracion Prisma y pruebas.

### Changed

- Los anuncios con estado `BLOCKED` dejan de aparecer en lecturas publicas.
- Los usuarios con estado `BLOCKED` no pueden publicar nuevos anuncios.

## [0.11.0] - 2026-07-09

### Added

- Modulo backend inicial de Notifications con notificaciones persistidas por usuario, endpoints protegidos de listado, contador y marcado de lectura, eventos Socket.IO locales y generacion desde ofertas, mensajes, transacciones y valoraciones.

## [0.10.0] - 2026-07-09

### Added

- Modulo backend inicial de Reviews con valoraciones autenticadas de transacciones completadas, restriccion de una valoracion por participante y transaccion, lectura publica por perfil, reputacion calculada, modelo Prisma, seed idempotente y pruebas.

## [0.9.0] - 2026-07-09

### Added

- Modulo backend inicial de Conversations con conversaciones idempotentes entre comprador y vendedor por anuncio, mensajes persistidos, marcado de lectura, endpoints REST protegidos, gateway Socket.IO local, seed idempotente y pruebas.

## [0.8.0] - 2026-07-09

### Added

- Modulo backend inicial de Transactions con transacciones autenticadas a partir de ofertas aceptadas, permisos por comprador/vendedor, endpoint de completado que marca el anuncio como vendido, modelo Prisma, seed idempotente y pruebas.

## [0.7.0] - 2026-07-09

### Added

- Modulo backend inicial de Offers con ofertas autenticadas sobre anuncios publicados, reglas de comprador/vendedor, estados `PENDING`, `ACCEPTED`, `REJECTED` y `CANCELLED`, endpoints REST protegidos, seed idempotente y pruebas.

## [0.6.0] - 2026-07-09

### Added

- Modulo backend inicial de Favorites con favoritos por usuario autenticado, restriccion unica por usuario/anuncio, endpoints REST protegidos, seed idempotente y pruebas.

## [0.5.0] - 2026-07-09

### Added

- Modulo backend inicial de Listings con anuncios asociados a vendedor y dimension, publicacion protegida por access token, lectura publica, seed idempotente, endpoints REST y pruebas.

## [0.4.0] - 2026-07-09

### Added

- Modulo backend inicial de Identity con cuentas de credenciales separadas de perfiles publicos, tokens JWT locales, refresh tokens revocables, endpoints REST y pruebas.

## [0.3.0] - 2026-07-09

### Added

- Modulo backend inicial de Users con perfiles publicos, reputacion, dimension de origen, seed idempotente, endpoints REST y pruebas.

## [0.2.0] - 2026-07-09

### Added

- Modulo backend inicial de Dimensions con modelo Prisma, seed, repositorio, caso de uso, controlador y pruebas.

## [0.1.0] - 2026-07-09

### Added

- Definicion inicial de Wormarket como proyecto.
- Preparacion documental base para el desarrollo local.
