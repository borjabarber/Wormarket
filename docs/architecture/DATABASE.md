# Database

Wormarket usa PostgreSQL en local mediante Docker Compose durante la fase de desarrollo local.

## Servicio local

- Servicio: `postgres`
- Contenedor: `wormarket-postgres`
- Imagen: `postgres:16-alpine`
- Host local: `localhost`
- Puerto local: `5432`
- Base de datos: `wormarket`
- Usuario local: `wormarket`

La contrasena `wormarket` es solo una credencial local de desarrollo y coincide con `.env.example`.

## URL local

```env
DATABASE_URL=postgresql://wormarket:wormarket@localhost:5432/wormarket
```

## Comandos

```bash
docker compose up -d
docker compose ps
docker compose down
```

## Prisma

Prisma queda configurado en el workspace `@wormarket/api`.

- Esquema: `apps/api/prisma/schema.prisma`
- Configuracion Prisma: `apps/api/prisma.config.ts`
- Cliente generado: `apps/api/src/generated/prisma`
- URL de base de datos: `DATABASE_URL`

Para generar el cliente local:

```bash
npm run db:generate
```

## Migraciones

Las migraciones locales se ejecutan con Prisma Migrate contra PostgreSQL local.

```bash
docker compose up -d
npm run db:migrate
```

Comandos utiles del workspace API:

```bash
npm run db:migrate --workspace=@wormarket/api
npm run db:migrate:create --workspace=@wormarket/api -- --name migration_name
npm run db:migrate:status --workspace=@wormarket/api
npm run db:reset --workspace=@wormarket/api
```

`db:migrate` usa `prisma migrate dev`, aplica migraciones locales y regenera el cliente Prisma. `db:migrate:create` crea una migracion sin aplicarla para revisarla antes de tocar la base. `db:reset` borra datos locales y solo debe usarse de forma explicita.

El esquema actual define los modelos principales del MVP local: dimensiones, usuarios, identidad, anuncios, favoritos, ofertas, transacciones, conversaciones, mensajes, valoraciones, notificaciones, denuncias y almacenamiento de rutas de imagen.

## Seed

El seed local se ejecuta desde el workspace API y usa Prisma Client contra PostgreSQL local.

```bash
docker compose up -d
npm run db:migrate
npm run db:seed
```

El seed actual crea o actualiza de forma idempotente tres dimensiones de demostracion:

- `oraculo-norte`
- `distrito-cronal`
- `archivo-horizonte`

Estas dimensiones sirven como catalogo inicial para filtros, perfiles y anuncios futuros.

Tambien crea o actualiza seis perfiles publicos de demostracion:

- `lyra-oraculo`
- `nadir-cronal`
- `io-horizonte`
- `vega-umbral`
- `zerodev`
- `braismoure`

Estos usuarios sirven para validar perfiles, reputacion, roles, credenciales demo y relaciones con dimensiones.
Sus avatares ficticios viven versionados en `apps/web/public/images/demo/users/` y se referencian como:

- `/images/demo/users/lyra-oraculo.png`
- `/images/demo/users/nadir-cronal.png`
- `/images/demo/users/vega-umbral.png`
- `/images/demo/users/io-horizonte.png`
- `/images/demo/users/zerodev.png`
- `/images/demo/users/braismoure.png`

Tambien crea o actualiza 13 anuncios de demostracion basados en el prompt maestro y en ampliaciones del catalogo visual local:

- `brujula-de-decisiones-no-tomadas`
- `reloj-de-siete-minutos-reversibles`
- `puerta-portatil-hacia-otra-dimension`
- `recuerdo-perteneciente-a-otra-persona`
- `planta-que-crece-cuando-alguien-miente`
- `piedra-con-gravedad-invertida`
- `mapa-de-lugares-que-aun-no-existen`
- `botella-que-contiene-una-tormenta`
- `espejo-que-muestra-versiones-alternativas`
- `traductor-de-lenguas-desaparecidas`
- `caja-de-ecos-prestados`
- `lente-para-ver-caminos-descartados`
- `farol-que-ilumina-portales-cerrados`

Estos anuncios sirven para validar el explorador futuro, detalle de anuncio, relaciones con vendedor/dimension y rareza. Sus imagenes visuales de demostracion viven versionadas en `apps/web/public/images/demo/` y se referencian como:

- `/images/demo/brujula-decisiones.png`
- `/images/demo/reloj-siete-minutos.png`
- `/images/demo/puerta-portatil-dimension.png`
- `/images/demo/recuerdo-ajeno.png`
- `/images/demo/planta-mentiras.png`
- `/images/demo/piedra-gravedad-invertida.png`
- `/images/demo/mapa-lugares-futuros.png`
- `/images/demo/botella-tormenta.png`
- `/images/demo/espejo-versiones-alternativas.png`
- `/images/demo/traductor-lenguas-desaparecidas.png`
- `/images/demo/caja-ecos-prestados.png`
- `/images/demo/lente-caminos-descartados.png`
- `/images/demo/farol-portales-cerrados.png`

Los tres anuncios adicionales tienen assets demo propios y versionados para mantener el catalogo local equilibrado sin depender de servicios externos.

Tambien crea o actualiza tres favoritos de demostracion, uno por usuario sembrado, para validar la lista `Mis favoritos` y la relacion entre usuarios y anuncios.

Tambien crea o actualiza tres ofertas de demostracion, una por usuario sembrado, para validar ofertas realizadas y recibidas.

Tambien crea o actualiza una transaccion completada de demostracion desde una oferta aceptada, para validar el flujo de compra local sin integrar pagos reales.

Tambien crea o actualiza conversaciones y mensajes de demostracion, para validar el chat local entre compradores y vendedores.

Tambien crea o actualiza valoraciones de demostracion, para validar reviews y reputacion calculada.

Tambien crea o actualiza notificaciones de demostracion, para validar bandeja local y estados de lectura.

Tambien crea o actualiza denuncias de demostracion, para validar moderacion local, roles y resoluciones.

## Modelo inicial

### `dimensions`

Tabla inicial del modulo Dimensions.

- `id`: identificador interno.
- `slug`: identificador legible y unico.
- `name`: nombre visible de la dimension.
- `description`: descripcion del universo.
- `currencyCode`: codigo interno de moneda.
- `currencyName`: nombre visible de la moneda.
- `exchangeRate`: tasa relativa para futuras conversiones.
- `shippingRules`: reglas de envio interdimensional.
- `forbiddenObjects`: lista de objetos prohibidos.
- `createdAt` y `updatedAt`: auditoria tecnica.

### `users`

Tabla inicial del modulo Users.

- `id`: identificador interno.
- `username`: identificador publico legible y unico.
- `displayName`: nombre visible.
- `bio`: descripcion publica del perfil.
- `avatarUrl`: URL opcional de avatar.
- `homeDimensionId`: dimension de origen del usuario.
- `reputation`: puntuacion publica no negativa.
- `role`: rol base (`USER`, `MODERATOR`, `ADMIN`) para autorizacion futura.
- `status`: estado (`ACTIVE`, `BLOCKED`) para restricciones de moderacion.
- `createdAt` y `updatedAt`: auditoria tecnica.

El modulo Users no almacena contrasenas ni tokens. Las credenciales pertenecen al modulo Identity.

### `identity_accounts`

Tabla inicial del modulo Identity.

- `id`: identificador interno de la cuenta de credenciales.
- `email`: email unico normalizado para inicio de sesion.
- `passwordHash`: hash PBKDF2 de la contrasena.
- `refreshTokenHash`: hash del refresh token vigente, nulo tras logout.
- `userId`: relacion unica con el perfil publico en `users`.
- `createdAt` y `updatedAt`: auditoria tecnica.

No almacena contrasenas en claro ni refresh tokens en claro.

### `listings`

Tabla inicial del modulo Listings.

- `id`: identificador interno.
- `slug`: identificador publico legible y unico.
- `sellerId`: usuario vendedor.
- `dimensionId`: dimension donde se publica el anuncio.
- `title`: titulo visible.
- `description`: descripcion visible.
- `price`: precio positivo.
- `currencyCode`: moneda de la dimension en el momento de publicar.
- `rarity`: rareza (`COMMON`, `RARE`, `EPIC`, `LEGENDARY`, `FORBIDDEN`).
- `status`: estado (`DRAFT`, `PUBLISHED`, `RESERVED`, `SOLD`, `CANCELLED`, `BLOCKED`).
- `imageUrls`: rutas o URLs de imagenes asociadas.
- `createdAt` y `updatedAt`: auditoria tecnica.

Los borrados de vendedor o dimension estan restringidos para no dejar anuncios huerfanos.

### `favorites`

Tabla inicial del modulo Favorites.

- `id`: identificador interno.
- `userId`: usuario que marca el favorito.
- `listingId`: anuncio marcado como favorito.
- `createdAt`: auditoria tecnica.

La combinacion `userId` y `listingId` es unica para impedir favoritos duplicados. Los borrados de usuario o anuncio eliminan sus favoritos asociados para no conservar relaciones huerfanas.

### `offers`

Tabla inicial del modulo Offers.

- `id`: identificador interno.
- `listingId`: anuncio sobre el que se oferta.
- `buyerId`: usuario comprador que realiza la oferta.
- `amount`: importe positivo ofrecido.
- `currencyCode`: moneda del anuncio en el momento de ofertar.
- `message`: mensaje opcional del comprador.
- `status`: estado (`PENDING`, `ACCEPTED`, `REJECTED`, `CANCELLED`).
- `createdAt` y `updatedAt`: auditoria tecnica.

Los borrados de usuario o anuncio estan restringidos para conservar la trazabilidad de negociaciones. La aceptacion de una oferta actualiza el anuncio a `RESERVED` y rechaza las demas ofertas pendientes del mismo anuncio.

### `transactions`

Tabla inicial del modulo Transactions.

- `id`: identificador interno.
- `offerId`: oferta aceptada que origina la transaccion, unica por transaccion.
- `listingId`: anuncio vendido o reservado, unico por transaccion.
- `buyerId`: comprador que realizo la oferta aceptada.
- `sellerId`: vendedor propietario del anuncio.
- `amount`: importe pactado.
- `currencyCode`: moneda pactada en la oferta.
- `status`: estado (`PENDING_DELIVERY`, `COMPLETED`, `CANCELLED`).
- `createdAt` y `updatedAt`: auditoria tecnica.
- `completedAt`: fecha de completado cuando la transaccion se cierra correctamente.

Los borrados de oferta, anuncio, comprador o vendedor estan restringidos para conservar trazabilidad. Crear una transaccion desde una oferta aceptada mantiene el anuncio en `RESERVED`; completar la transaccion marca el anuncio como `SOLD`.

### `conversations`

Tabla inicial del modulo Conversations.

- `id`: identificador interno.
- `listingId`: anuncio sobre el que conversan los participantes.
- `buyerId`: comprador o interesado que inicia la conversacion.
- `sellerId`: vendedor propietario del anuncio.
- `createdAt` y `updatedAt`: auditoria tecnica.

La combinacion `listingId`, `buyerId` y `sellerId` es unica para que crear una conversacion sea idempotente por anuncio y participantes. Los borrados de anuncio o usuarios estan restringidos para conservar trazabilidad.

### `messages`

Tabla inicial de mensajes de Conversations.

- `id`: identificador interno.
- `conversationId`: conversacion a la que pertenece el mensaje.
- `senderId`: usuario participante que envia el mensaje.
- `content`: contenido textual validado por el backend.
- `createdAt`: fecha de envio.
- `readAt`: fecha de lectura cuando el otro participante marca el mensaje como leido.

Los mensajes se eliminan en cascada si se elimina su conversacion. El borrado de remitentes esta restringido para conservar autoria.

### `reviews`

Tabla inicial del modulo Reviews.

- `id`: identificador interno.
- `transactionId`: transaccion completada que se valora.
- `reviewerId`: participante que emite la valoracion.
- `revieweeId`: otro participante que recibe la valoracion.
- `rating`: puntuacion entera entre 1 y 5.
- `comment`: comentario opcional.
- `createdAt` y `updatedAt`: auditoria tecnica.

La combinacion `transactionId` y `reviewerId` es unica para impedir que un participante valore dos veces la misma transaccion. Los borrados de transaccion o usuarios estan restringidos para conservar trazabilidad. La reputacion publica del usuario valorado se recalcula a partir de la media de estrellas en escala 0-100.

### `notifications`

Tabla inicial del modulo Notifications.

- `id`: identificador interno.
- `userId`: usuario propietario de la notificacion.
- `type`: tipo (`OFFER_RECEIVED`, `OFFER_ACCEPTED`, `OFFER_REJECTED`, `MESSAGE_RECEIVED`, `TRANSACTION_COMPLETED`, `REVIEW_RECEIVED`).
- `title`: titulo visible en espanol.
- `message`: cuerpo visible en espanol.
- `linkPath`: ruta interna opcional hacia el recurso relacionado.
- `readAt`: fecha de lectura, nula mientras este pendiente.
- `createdAt`: fecha de creacion.

Las notificaciones se eliminan en cascada si se elimina su usuario propietario. Los indices por usuario, tipo, lectura y fecha permiten listar bandeja, contar no leidas y ordenar por actividad reciente.

### `reports`

Tabla inicial del modulo Moderation.

- `id`: identificador interno.
- `reporterId`: usuario autenticado que crea la denuncia.
- `targetType`: tipo de objetivo (`LISTING`, `USER`).
- `listingId`: anuncio denunciado cuando el objetivo es un anuncio.
- `reportedUserId`: usuario denunciado cuando el objetivo es un perfil.
- `reason`: motivo (`FORBIDDEN_OBJECT`, `FRAUD`, `HARASSMENT`, `SPAM`, `OTHER`).
- `description`: descripcion visible para moderacion.
- `status`: estado (`PENDING`, `RESOLVED`, `DISMISSED`).
- `resolution`: resolucion textual opcional.
- `resolvedById`: moderador que resolvio la denuncia.
- `resolvedAt`: fecha de resolucion.
- `createdAt` y `updatedAt`: auditoria tecnica.

Los borrados de usuarios y anuncios estan restringidos para conservar trazabilidad de moderacion. Los indices por objetivo, estado, motivo y fecha permiten revisar la cola local de denuncias.

## Persistencia

Los datos locales se guardan en el volumen nombrado `wormarket_postgres_data`.

## Almacenamiento local de archivos

Las imagenes subidas en desarrollo local no se guardan en PostgreSQL. El modulo Storage usa `STORAGE_DRIVER=local` y escribe archivos en `LOCAL_UPLOAD_PATH`, por defecto `uploads/`.

- `POST /storage/uploads`: subida autenticada mediante access token.
- `GET /uploads/:fileName`: lectura publica de imagenes ya subidas.
- Tipos permitidos: JPG, PNG, WebP y GIF.
- Tamano maximo por archivo: 2 MB.
- El directorio `uploads/` esta ignorado por Git.

Los anuncios siguen persistiendo solo las URLs o rutas publicas de imagen en `listings.imageUrls`, lo que permite sustituir el adaptador local por Cloudinary en la fase de despliegue sin migrar blobs en base de datos.

Las imagenes demo versionadas no se guardan en `uploads/`; se sirven desde el frontend local mediante `/images/demo/...`.

Para eliminar el volumen local de PostgreSQL se debe usar explicitamente:

```bash
docker compose down -v
```

Ese comando borra los datos locales y no debe ejecutarse salvo que se quiera reiniciar la base de datos desde cero.
