# Modulos de Wormarket

Wormarket se organiza como monolito modular.

## Backend

Cada modulo de `apps/api` debe separar dominio, aplicacion, infraestructura y presentacion cuando la complejidad lo justifique.

```text
modules/
  identity/
  users/
  dimensions/
  listings/
  favorites/
  offers/
  transactions/
  conversations/
  reviews/
  notifications/
  moderation/
  storage/
```

## Frontend

`apps/web` se organizara por funcionalidades.

```text
src/
  app/
  features/
    auth/
    dimensions/
    listings/
    favorites/
    offers/
    conversations/
    reviews/
    profile/
    transactions/
    notifications/
    moderation/
    storage/
  shared/
```

## Reglas

- No mezclar reglas de dominio con controladores.
- No exponer modelos Prisma directamente en respuestas publicas.
- Compartir tipos estables mediante `packages/shared-types`.
- Compartir esquemas de validacion mediante `packages/shared-validation` cuando aporten valor.

## Dimensions

Estado: implementado en backend y consumido por frontend.

Responsabilidades actuales:

- Modelar dimensiones disponibles para Wormarket.
- Exponer `GET /dimensions`.
- Mantener reglas basicas de moneda, envio y objetos prohibidos.
- Persistir los datos en PostgreSQL mediante Prisma.

Responsabilidades futuras:

- Incorporar administracion o moderacion de dimensiones cuando existan roles.

## Users

Estado: implementado en backend y frontend.

Responsabilidades actuales:

- Modelar perfiles publicos de usuario.
- Exponer `GET /users` y `GET /users/:username`.
- Asociar cada usuario a una dimension de origen.
- Mantener reputacion publica y rol base para autorizacion futura.
- Mantener estado publico (`ACTIVE` o `BLOCKED`) para aplicar restricciones de moderacion.
- Persistir los datos en PostgreSQL mediante Prisma.

Fuera de alcance actual:

- Registro, inicio de sesion, contrasenas, JWT y refresh tokens pertenecen al modulo Identity.
- Edicion avanzada de perfil queda fuera del flujo principal local actual.

## Identity

Estado: implementado en backend y frontend.

Responsabilidades actuales:

- Registrar usuarios creando perfil publico y cuenta de credenciales.
- Iniciar sesion con email y contrasena.
- Emitir access token y refresh token JWT para desarrollo local.
- Guardar contrasenas con hash PBKDF2.
- Guardar solo el hash del refresh token vigente.
- Exponer `POST /identity/register`, `POST /identity/login`, `POST /identity/refresh`, `GET /identity/me` y `POST /identity/logout`.

Responsabilidades futuras:

- Cookies seguras y endurecimiento de configuracion en fase de despliegue.

## Listings

Estado: implementado en backend y frontend.

Responsabilidades actuales:

- Modelar anuncios publicados por usuarios.
- Asociar cada anuncio a vendedor y dimension.
- Exponer `GET /listings`, `GET /listings/:slug`, `POST /listings` y `PATCH /listings/:slug`.
- Permitir lectura publica de anuncios.
- Ocultar anuncios bloqueados en lecturas publicas.
- Proteger la publicacion de anuncios mediante access token.
- Impedir que usuarios bloqueados publiquen nuevos anuncios.
- Mantener precio, moneda dimensional, rareza, estado e imagenes locales como cadenas.
- Persistir los datos en PostgreSQL mediante Prisma.

Responsabilidades futuras:

- Eliminar o retirar anuncios desde una pantalla dedicada si se decide incorporarlo al cierre del MVP.
- Paginacion y busqueda avanzada si el volumen de anuncios crece.

## Favorites

Estado: implementado en backend y frontend.

Responsabilidades actuales:

- Modelar favoritos de usuarios sobre anuncios.
- Exponer `GET /favorites`, `POST /favorites/:listingSlug` y `DELETE /favorites/:listingSlug`.
- Proteger todas las rutas mediante access token.
- Evitar duplicados por usuario y anuncio mediante restriccion unica.
- Devolver favoritos con informacion suficiente del anuncio, vendedor y dimension.
- Persistir los datos en PostgreSQL mediante Prisma.

Responsabilidades futuras:

- Mostrar estados de favorito precargados en consultas publicas si se necesita reducir llamadas.
- Anadir paginacion si el volumen local de favoritos crece.

## Offers

Estado: implementado en backend y frontend.

Responsabilidades actuales:

- Modelar ofertas realizadas por compradores sobre anuncios publicados.
- Exponer `POST /offers`, `GET /offers`, `GET /listings/:listingSlug/offers`, `POST /offers/:offerId/accept`, `POST /offers/:offerId/reject` y `POST /offers/:offerId/cancel`.
- Proteger todas las rutas mediante access token.
- Impedir ofertas sobre anuncios propios.
- Impedir ofertas sobre anuncios que no esten publicados.
- Permitir que el vendedor vea, acepte o rechace ofertas de sus anuncios.
- Permitir que el comprador cancele ofertas pendientes.
- Al aceptar una oferta, reservar el anuncio y rechazar las demas ofertas pendientes del mismo anuncio.
- Persistir los datos en PostgreSQL mediante Prisma.

Responsabilidades futuras:

- Anadir contraofertas si aportan valor al MVP.

## Transactions

Estado: implementado en backend y frontend.

Responsabilidades actuales:

- Modelar transacciones creadas desde ofertas aceptadas.
- Exponer `GET /transactions`, `GET /transactions/:transactionId`, `POST /transactions/from-offer/:offerId` y `POST /transactions/:transactionId/complete`.
- Proteger todas las rutas mediante access token.
- Permitir que solo el vendedor del anuncio cree una transaccion desde una oferta aceptada.
- Hacer idempotente la creacion de transacciones por oferta aceptada.
- Permitir que comprador y vendedor consulten sus transacciones.
- Permitir que comprador o vendedor completen una transaccion pendiente.
- Al completar una transaccion, marcar el anuncio como vendido.
- Persistir los datos en PostgreSQL mediante Prisma.

Responsabilidades futuras:

- Ampliar estados si el MVP necesita cancelaciones operativas o disputas.

## Conversations

Estado: implementado en backend y frontend.

Responsabilidades actuales:

- Modelar conversaciones entre comprador y vendedor alrededor de un anuncio.
- Exponer `GET /conversations`, `GET /conversations/:conversationId`, `POST /conversations`, `GET /conversations/:conversationId/messages`, `POST /conversations/:conversationId/messages` y `POST /conversations/:conversationId/read`.
- Proteger todas las rutas mediante access token.
- Impedir que un vendedor inicie una conversacion consigo mismo sobre su propio anuncio.
- Hacer idempotente la creacion de conversaciones por anuncio, comprador y vendedor.
- Permitir que solo los participantes listen, consulten, envien mensajes o marquen lectura.
- Persistir conversaciones y mensajes en PostgreSQL mediante Prisma.
- Exponer un gateway Socket.IO local en el namespace `/conversations` con eventos `conversation:join`, `message:send`, `message:sent` y `message:read`.

Responsabilidades futuras:

- Anadir paginacion si el volumen local de mensajes crece.

## Reviews

Estado: implementado en backend y frontend.

Responsabilidades actuales:

- Modelar valoraciones entre participantes de transacciones completadas.
- Exponer `POST /reviews` y `GET /users/:username/reviews`.
- Proteger la creacion de valoraciones mediante access token.
- Permitir que solo comprador o vendedor valoren una transaccion en la que participan.
- Impedir valoraciones sobre transacciones no completadas.
- Impedir mas de una valoracion por participante y transaccion.
- Calcular reputacion publica del usuario valorado como media de estrellas en escala 0-100.
- Persistir valoraciones en PostgreSQL mediante Prisma.

Responsabilidades futuras:

- Anadir moderacion de comentarios si el producto lo necesita.

## Notifications

Estado: implementado en backend y frontend.

Responsabilidades actuales:

- Modelar notificaciones persistidas por usuario.
- Exponer `GET /notifications`, `GET /notifications/unread-count`, `POST /notifications/:notificationId/read` y `POST /notifications/read-all`.
- Proteger todas las rutas mediante access token.
- Permitir que solo el propietario liste o marque sus notificaciones.
- Emitir notificaciones en tiempo real mediante Socket.IO local en el namespace `/notifications`.
- Generar notificaciones para ofertas recibidas, ofertas aceptadas o rechazadas, mensajes recibidos, transacciones completadas y valoraciones recibidas.
- Persistir notificaciones en PostgreSQL mediante Prisma.

Responsabilidades futuras:

- Anadir preferencias de notificacion si el MVP lo necesita.
- Anadir paginacion si el volumen local de notificaciones crece.

## Moderation

Estado: implementado en backend y frontend.

Responsabilidades actuales:

- Modelar denuncias sobre anuncios y perfiles.
- Exponer `POST /moderation/reports/listings/:slug`, `POST /moderation/reports/users/:username`, `GET /moderation/reports`, `POST /moderation/reports/:reportId/resolve`, `POST /moderation/listings/:slug/block` y `POST /moderation/users/:username/block`.
- Permitir que usuarios autenticados creen denuncias.
- Restringir listado, resolucion y bloqueos a roles `MODERATOR` o `ADMIN`.
- Marcar anuncios como `BLOCKED` para ocultarlos de lecturas publicas.
- Marcar usuarios como `BLOCKED` para impedir nuevas publicaciones.
- Persistir denuncias y resoluciones en PostgreSQL mediante Prisma.

Responsabilidades futuras:

- Anadir historial de acciones de moderacion si el MVP lo necesita.
- Notificar a usuarios afectados cuando existan decisiones de producto claras.

## Storage

Estado: implementado en backend y frontend.

Responsabilidades actuales:

- Exponer `POST /storage/uploads` para subir imagenes locales autenticadas en base64.
- Exponer `GET /uploads/:fileName` para servir imagenes locales subidas durante desarrollo.
- Validar tipo MIME, firma de archivo y tamano maximo.
- Mantener `uploads/` fuera de Git.
- Permitir que el formulario de anuncios combine URLs existentes y archivos locales.

Responsabilidades futuras:

- Sustituir el adaptador local por Cloudinary durante la fase de despliegue aprobada.
