# @wormarket/api

Backend de Wormarket.

Este workspace contiene la aplicacion NestJS local de Wormarket.

## Comandos

```bash
npm run dev --workspace=@wormarket/api
npm run build --workspace=@wormarket/api
npm run typecheck --workspace=@wormarket/api
```

El backend local escucha por defecto en `http://localhost:3001`.

## Salud

```text
GET /health
```

La ruta devuelve el estado basico del servicio para validar que la API local esta activa.

## Dimensions

```text
GET /dimensions
```

Devuelve las dimensiones disponibles para el marketplace local, incluyendo moneda, tipo de cambio, reglas de envio y objetos prohibidos. Los datos iniciales se cargan con `npm run db:seed`.

## Users

```text
GET /users
GET /users/:username
```

Devuelve perfiles publicos de usuario con reputacion, estado, rol y dimension de origen. La autenticacion, credenciales y tokens pertenecen al modulo Identity.

## Identity

```text
POST /identity/register
POST /identity/login
POST /identity/refresh
GET /identity/me
POST /identity/logout
```

Gestiona registro, inicio de sesion, access token, refresh token, cierre de sesion y lectura de la identidad autenticada. Las contrasenas se almacenan cifradas mediante PBKDF2 y los refresh tokens solo se guardan como hash.

Variables requeridas para probar Identity en local:

```env
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
```

No se guardan secretos reales en el repositorio.

Al arrancar la API, el backend carga el `.env` local de la raiz si existe y no sobrescribe variables ya definidas en la terminal.

## Listings

```text
GET /listings
GET /listings/:slug
POST /listings
PATCH /listings/:slug
```

Devuelve anuncios no bloqueados con vendedor, dimension, precio, rareza, estado e imagenes locales. La creacion de anuncios requiere un access token en la cabecera `Authorization: Bearer <token>` y se rechaza si el usuario esta bloqueado. La edicion requiere token del vendedor propietario, conserva el slug y permite modificar dimension, titulo, descripcion, precio, rareza e imagenes de anuncios editables.

## Favorites

```text
GET /favorites
POST /favorites/:listingSlug
DELETE /favorites/:listingSlug
```

Gestiona la lista de favoritos del usuario autenticado. Todas las rutas requieren un access token en la cabecera `Authorization: Bearer <token>`. Anadir un favorito es idempotente y no crea duplicados para el mismo usuario y anuncio.

## Offers

```text
GET /offers
POST /offers
GET /listings/:listingSlug/offers
POST /offers/:offerId/accept
POST /offers/:offerId/reject
POST /offers/:offerId/cancel
```

Gestiona ofertas autenticadas sobre anuncios publicados. Un usuario no puede ofertar por su propio anuncio ni por anuncios que no esten publicados. El vendedor puede ver, aceptar o rechazar ofertas de sus anuncios; el comprador puede cancelar sus ofertas pendientes. Aceptar una oferta reserva el anuncio y rechaza las demas ofertas pendientes.

## Notifications

```text
GET /notifications
GET /notifications/unread-count
POST /notifications/:notificationId/read
POST /notifications/read-all
```

Gestiona notificaciones autenticadas del usuario actual. Las notificaciones se generan para ofertas recibidas, ofertas aceptadas o rechazadas, mensajes recibidos, transacciones completadas y valoraciones recibidas. Solo el propietario puede listar o marcar como leidas sus notificaciones.

El gateway Socket.IO local usa el namespace `/notifications`. El cliente debe enviar el access token en `handshake.auth.token` o en la cabecera `Authorization: Bearer <token>`. Eventos disponibles:

```text
notifications:join
notification:new
```

## Transactions

```text
GET /transactions
GET /transactions/:transactionId
POST /transactions/from-offer/:offerId
POST /transactions/:transactionId/complete
```

Gestiona transacciones autenticadas a partir de ofertas aceptadas. El vendedor del anuncio puede crear una transaccion desde una oferta aceptada de forma idempotente. Comprador y vendedor pueden listar y consultar sus transacciones. Completar una transaccion cambia su estado a `COMPLETED`, registra `completedAt` y marca el anuncio como `SOLD`.

## Conversations

```text
GET /conversations
GET /conversations/:conversationId
POST /conversations
GET /conversations/:conversationId/messages
POST /conversations/:conversationId/messages
POST /conversations/:conversationId/read
```

Gestiona conversaciones autenticadas entre comprador y vendedor alrededor de un anuncio. Crear una conversacion es idempotente para la combinacion anuncio/comprador/vendedor. Solo los participantes pueden listar, consultar, enviar mensajes o marcar mensajes como leidos.

El gateway Socket.IO local usa el namespace `/conversations`. El cliente debe enviar el access token en `handshake.auth.token` o en la cabecera `Authorization: Bearer <token>`. Eventos disponibles:

```text
conversation:join
message:send
message:sent
message:read
```

## Reviews

```text
POST /reviews
GET /users/:username/reviews
```

Gestiona valoraciones de transacciones completadas. Crear una valoracion requiere access token y solo esta permitido a comprador o vendedor de la transaccion. Cada participante puede valorar una vez por transaccion y la valoracion siempre se asigna al otro participante. La lectura de valoraciones por perfil publico no requiere autenticacion. La reputacion del usuario valorado se recalcula como media de estrellas en escala 0-100.

## Moderation

```text
POST /moderation/reports/listings/:slug
POST /moderation/reports/users/:username
GET /moderation/reports
POST /moderation/reports/:reportId/resolve
POST /moderation/listings/:slug/block
POST /moderation/users/:username/block
```

Gestiona denuncias y acciones basicas de moderacion. Crear denuncias requiere access token y esta disponible para usuarios autenticados. Listar denuncias, resolverlas, bloquear anuncios y bloquear usuarios requiere rol `MODERATOR` o `ADMIN`. Bloquear un anuncio cambia su estado a `BLOCKED` y lo oculta de las lecturas publicas; bloquear un usuario cambia su estado a `BLOCKED` e impide que publique nuevos anuncios.

## Pendiente

Swagger, guards reutilizables y el resto de modulos de frontend se configuraran en sus tareas correspondientes.
