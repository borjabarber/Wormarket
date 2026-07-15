# Arquitectura de Wormarket

Wormarket se desarrolla como monorepo con frontend Next.js, backend NestJS, paquetes compartidos y PostgreSQL local mediante Docker.

La arquitectura aplicada combina:

* **Monolito modular**
* **Clean Architecture**
* **Domain-Driven Design ligero**
* **CQRS ligero**
* **Eventos de dominio internos**

Esta solución permite desarrollar una aplicación organizada, mantenible y escalable sin introducir la complejidad innecesaria de una arquitectura basada en microservicios.

## Estado actual

Versión documental: `0.27.15`.

La fase local ya contiene módulos backend para Dimensions, Users, Identity, Listings, Favorites, Offers, Transactions, Conversations, Reviews, Notifications, Moderation y Storage. El frontend ya contiene pantallas conectadas para el flujo principal del marketplace local. La validación completa del flujo queda para la tarea posterior `Validar flujo completo local`.

---

## 1. Arquitectura general

La aplicación seguirá los principios de Clean Architecture, separando las responsabilidades en diferentes capas:

```text id="d6vdx8"
Frontend
   ↓
API / Controllers
   ↓
Application
   ↓
Domain
   ↓
Infrastructure
   ↓
Base de datos y servicios externos
```

La regla principal es que las capas internas no dependan de las externas:

```text id="8vzzb5"
Infrastructure → Application → Domain
Presentation   → Application → Domain
```

La capa de dominio no debe conocer detalles relacionados con frameworks, bases de datos, protocolos HTTP o servicios externos.

---

## 2. Monolito modular

En lugar de utilizar microservicios, el sistema se desarrollará como un monolito modular.

Esto significa que toda la aplicación se ejecutará como una única unidad, pero estará dividida internamente en módulos independientes según las funcionalidades del sistema.

```text id="gf66g0"
src/
├── modules/
│   ├── identity/
│   ├── users/
│   ├── listings/
│   ├── dimensions/
│   ├── offers/
│   ├── conversations/
│   ├── reviews/
│   ├── favorites/
│   ├── transactions/
│   ├── notifications/
│   ├── moderation/
│   └── storage/
│
├── shared/
└── infrastructure/
```

Los módulos principales serían:

* **Identity:** registro, inicio de sesión y autenticación.
* **Users:** perfiles de usuario y reputación.
* **Listings:** publicación y gestión de objetos.
* **Dimensions:** dimensiones, monedas y reglas interdimensionales.
* **Offers:** sistema de ofertas y contraofertas.
* **Conversations:** chat entre compradores y vendedores.
* **Reviews:** valoraciones entre usuarios.
* **Favorites:** anuncios guardados.
* **Moderation:** denuncias, bloqueos y administración.
* **Transactions:** cierre de operaciones tras ofertas aceptadas.
* **Notifications:** bandeja y eventos en tiempo real.
* **Storage:** subida local de imágenes y adaptador futuro para Cloudinary.

---

## 3. Estructura interna de cada módulo

Cada módulo puede organizarse siguiendo las capas de Clean Architecture.

```text id="v2t8ho"
listings/
├── domain/
│   ├── entities/
│   ├── value-objects/
│   ├── repositories/
│   ├── services/
│   └── errors/
│
├── application/
│   ├── use-cases/
│   ├── dto/
│   ├── ports/
│   └── mappers/
│
├── infrastructure/
│   ├── persistence/
│   ├── repositories/
│   └── external-services/
│
└── presentation/
    ├── controllers/
    ├── requests/
    └── responses/
```

### Domain

Contiene la lógica de negocio principal:

* Entidades.
* Value Objects.
* Reglas de negocio.
* Interfaces de repositorios.
* Servicios de dominio.
* Errores del dominio.

### Application

Contiene los casos de uso del sistema:

* Crear un anuncio.
* Realizar una oferta.
* Aceptar una oferta.
* Buscar objetos.
* Enviar mensajes.
* Valorar usuarios.

### Infrastructure

Contiene las implementaciones técnicas:

* Repositorios.
* ORM.
* Base de datos.
* Almacenamiento de imágenes.
* Envío de correos.
* Servicios externos.

### Presentation

Contiene los puntos de entrada de la aplicación:

* Controladores REST.
* Validación de peticiones.
* WebSockets.
* Respuestas de la API.

---

## 4. Entidades principales

Las entidades principales del sistema serían:

```text id="i8bp7p"
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
```

### User

Representa a un usuario registrado.

Atributos principales:

```text id="z6i60i"
id
username
email
password
avatar
dimensionId
reputation
createdAt
```

### Listing

Representa un objeto publicado en el marketplace.

```text id="gr4xfw"
id
sellerId
title
description
price
currency
dimensionId
rarity
status
images
createdAt
```

### Dimension

Representa una dimensión dentro del universo de la aplicación.

```text id="zozs83"
id
name
description
currency
exchangeRate
shippingRules
forbiddenObjects
```

### Offer

Representa una oferta realizada por un comprador.

```text id="imw8mt"
id
listingId
buyerId
amount
currency
status
createdAt
```

### Conversation

Representa una conversación entre dos usuarios.

```text id="w55kim"
id
listingId
buyerId
sellerId
createdAt
```

### Message

Representa un mensaje enviado dentro de una conversación.

```text id="ynj9l7"
id
conversationId
senderId
content
createdAt
readAt
```

### Review

Representa una valoración realizada después de una transacción.

```text id="atb6oh"
id
authorId
targetUserId
transactionId
rating
comment
createdAt
```

---

## 5. Value Objects

Los Value Objects permiten encapsular conceptos importantes del dominio.

Algunos ejemplos serían:

```text id="475qkx"
Money
ListingId
UserId
DimensionId
Rarity
ListingStatus
OfferStatus
ReputationScore
InterdimensionalCoordinates
```

### Money

El objeto `Money` puede representar una cantidad económica dentro de una dimensión.

```text id="k2y7i2"
amount
currency
dimensionId
exchangeRate
```

Este objeto permitiría trabajar con diferentes monedas interdimensionales y realizar conversiones entre ellas.

### Rarity

La rareza de un objeto podría estar limitada a valores concretos:

```text id="snq2f6"
COMMON
RARE
EPIC
LEGENDARY
FORBIDDEN
```

### ListingStatus

Los estados posibles de un anuncio podrían ser:

```text id="6aj3xz"
DRAFT
PUBLISHED
RESERVED
SOLD
CANCELLED
BLOCKED
```

---

## 6. Reglas de negocio

Las reglas principales deben encontrarse en la capa de dominio y no en los controladores.

Algunos ejemplos serían:

* Un usuario no puede comprar su propio objeto.
* Un anuncio vendido no puede recibir nuevas ofertas.
* El precio de un objeto no puede ser negativo.
* Un objeto prohibido no puede publicarse en determinadas dimensiones.
* Una oferta no puede superar determinados límites dimensionales.
* Un objeto legendario puede requerir validación por parte de un moderador.
* Al aceptar una oferta, el resto de ofertas deben rechazarse.
* Un usuario no puede valorar a otro sin haber completado una transacción.
* Un usuario bloqueado no puede publicar nuevos objetos.
* El coste del envío puede variar según la distancia entre dimensiones.

---

## 7. Casos de uso

Los casos de uso se implementarían en la capa de aplicación.

### Anuncios

```text id="e9fkk3"
CreateListing
UpdateListing
DeleteListing
PublishListing
GetListing
SearchListings
MarkListingAsReserved
MarkListingAsSold
```

### Ofertas

```text id="7p5tq8"
CreateOffer
AcceptOffer
RejectOffer
CancelOffer
CreateCounterOffer
GetListingOffers
```

### Usuarios

```text id="x33s6x"
RegisterUser
LoginUser
GetUserProfile
UpdateUserProfile
BlockUser
GetUserListings
```

### Chat

```text id="sx0v4a"
CreateConversation
SendMessage
GetConversationMessages
MarkMessageAsRead
```

### Valoraciones

```text id="s9s7vd"
CreateReview
GetUserReviews
CalculateUserReputation
```

### Moderación

```text id="84qb1g"
ReportListing
ReportUser
BlockListing
BlockUser
ResolveReport
```

---

## 8. Ejemplo de caso de uso

Un caso de uso para crear un anuncio podría tener la siguiente estructura:

```typescript id="2h9ofj"
class CreateListingUseCase {
  constructor(
    private readonly listingRepository: ListingRepository,
    private readonly dimensionRepository: DimensionRepository
  ) {}

  async execute(command: CreateListingCommand): Promise<ListingDto> {
    const dimension = await this.dimensionRepository.findById(
      command.dimensionId
    );

    if (!dimension) {
      throw new DimensionNotFoundError();
    }

    const listing = Listing.create({
      sellerId: command.sellerId,
      title: command.title,
      description: command.description,
      price: command.price,
      dimension
    });

    await this.listingRepository.save(listing);

    return ListingMapper.toDto(listing);
  }
}
```

La interfaz del repositorio se definiría dentro del dominio:

```typescript id="806de8"
interface ListingRepository {
  save(listing: Listing): Promise<void>;
  findById(id: ListingId): Promise<Listing | null>;
  delete(id: ListingId): Promise<void>;
}
```

La implementación concreta se encontraría en infraestructura:

```typescript id="zj4tef"
class PrismaListingRepository implements ListingRepository {
  async save(listing: Listing): Promise<void> {
    // Persistencia mediante Prisma
  }

  async findById(id: ListingId): Promise<Listing | null> {
    // Consulta a PostgreSQL
    return null;
  }

  async delete(id: ListingId): Promise<void> {
    // Eliminación del anuncio
  }
}
```

De esta manera, el dominio no depende directamente de Prisma ni de PostgreSQL.

---

## 9. Domain-Driven Design ligero

No es necesario implementar DDD de forma completa.

Se utilizarán únicamente los elementos que aporten valor al proyecto:

* Entidades.
* Value Objects.
* Agregados.
* Repositorios.
* Servicios de dominio.
* Eventos de dominio.

### Agregado Listing

```text id="lt392m"
Listing Aggregate
├── Listing
├── ListingImages
└── Offers
```

El anuncio sería la raíz del agregado y controlaría las operaciones relacionadas con sus imágenes y ofertas.

### Agregado Conversation

```text id="du97ic"
Conversation Aggregate
├── Conversation
└── Messages
```

La conversación controlaría el envío y acceso a sus mensajes.

---

## 10. Eventos de dominio

Los eventos de dominio permiten reaccionar ante acciones importantes del sistema.

```text id="m84eel"
ListingCreated
ListingPublished
OfferCreated
OfferAccepted
OfferRejected
ListingReserved
ListingSold
MessageSent
UserReported
ReviewCreated
```

Ejemplo del flujo producido al aceptar una oferta:

```text id="1p5l25"
OfferAccepted
   ↓
Marcar anuncio como reservado
   ↓
Rechazar el resto de ofertas
   ↓
Crear una transacción
   ↓
Notificar al comprador
   ↓
Notificar al vendedor
```

Durante la primera versión, estos eventos pueden ejecutarse internamente dentro del mismo backend.

No sería necesario utilizar inicialmente herramientas como Kafka o RabbitMQ.

---

## 11. CQRS ligero

Se puede aplicar una separación conceptual entre operaciones de escritura y lectura.

### Commands

Modifican el estado del sistema.

```text id="5l6dhl"
CreateListing
UpdateListing
MakeOffer
AcceptOffer
RejectOffer
SendMessage
CreateReview
```

### Queries

Consultan información sin modificarla.

```text id="zdqel4"
GetListing
SearchListings
GetUserProfile
GetUserListings
GetConversations
GetConversationMessages
```

No es necesario utilizar bases de datos separadas.

La separación se aplicaría únicamente en la organización de los casos de uso.

---

## 12. Arquitectura del frontend

El frontend puede organizarse por funcionalidades.

```text id="59u7qw"
src/
├── app/
├── pages/
├── features/
│   ├── authentication/
│   ├── listings/
│   ├── marketplace/
│   ├── offers/
│   ├── chat/
│   ├── reviews/
│   └── profile/
│
├── entities/
└── shared/
```

Dentro de una funcionalidad:

```text id="cwd7rg"
listings/
├── api/
├── components/
├── hooks/
├── models/
├── services/
└── validation/
```

Esta organización resulta más escalable que separar toda la aplicación únicamente por tipos de archivo.

Por ejemplo, se debería evitar una estructura global como:

```text id="yzotb9"
components/
services/
hooks/
pages/
```

Cuando el proyecto crece, esta estructura puede dificultar la localización de los archivos relacionados con una funcionalidad concreta.

---

## 13. Tecnologías recomendadas

Una posible pila tecnológica sería:

### Frontend

```text id="bcuseb"
Next.js
React
TypeScript
Tailwind CSS
React Query
Zod
```

### Backend

```text id="6ljysm"
NestJS
TypeScript
Prisma
Socket.IO
JWT
```

### Base de datos

```text id="j15zgp"
PostgreSQL
```

### Almacenamiento de imágenes

```text id="x8ofo0"
Cloudinary
Amazon S3
Supabase Storage
```

### Testing

```text id="6fb8vp"
Jest
Vitest
React Testing Library
Supertest
```

### Infraestructura

```text id="o453d0"
Docker
Docker Compose
GitHub Actions
```

Una combinación equilibrada para el proyecto sería:

```text id="66wcqk"
Next.js
NestJS
PostgreSQL
Prisma
Socket.IO
Docker
```

NestJS encaja especialmente bien con Clean Architecture debido a su sistema de módulos, controladores e inyección de dependencias.

---

## 14. Comunicación en tiempo real

El chat puede implementarse mediante WebSockets.

```text id="kmnes0"
Cliente
   ↓
Socket.IO
   ↓
Conversations Module
   ↓
PostgreSQL
```

Los WebSockets se utilizarían para:

* Enviar mensajes en tiempo real.
* Mostrar usuarios conectados.
* Confirmar la lectura de mensajes.
* Notificar nuevas ofertas.
* Notificar ofertas aceptadas o rechazadas.
* Avisar de cambios en el estado de un anuncio.

---

## 15. Autenticación

La autenticación puede realizarse utilizando:

```text id="4t82u9"
Access Token
Refresh Token
```

El flujo sería:

```text id="lbk5lo"
Registro o inicio de sesión
   ↓
Generación de Access Token
   ↓
Generación de Refresh Token
   ↓
Acceso a rutas protegidas
   ↓
Renovación del Access Token
```

También se podrían añadir:

* Verificación de correo electrónico.
* Recuperación de contraseña.
* Inicio de sesión mediante Google o GitHub.
* Roles de usuario.

Los roles principales serían:

```text id="qt2zv3"
USER
MODERATOR
ADMIN
```

---

## 16. Despliegue

La aplicación podría desplegarse inicialmente de la siguiente forma:

```text id="6ipohj"
Frontend → Vercel
Backend → Railway, Render o Fly.io
Database → PostgreSQL gestionado
Images → Cloudinary o S3
```

La arquitectura de despliegue sería:

```text id="qr1jw7"
Cliente web
   ↓
Frontend Next.js
   ↓
API NestJS
   ↓
PostgreSQL

Servicios externos:
- Almacenamiento de imágenes
- Servicio de correo
- WebSockets
```

---

## 17. Testing

La arquitectura propuesta facilita la implementación de diferentes tipos de pruebas.

### Pruebas unitarias

Se utilizarían para comprobar:

* Entidades.
* Value Objects.
* Reglas del dominio.
* Casos de uso.
* Servicios de dominio.

### Pruebas de integración

Se utilizarían para comprobar:

* Repositorios.
* Base de datos.
* Controladores.
* Autenticación.
* WebSockets.

### Pruebas end-to-end

Se utilizarían para comprobar flujos completos como:

```text id="4aq2kb"
Registro
   ↓
Inicio de sesión
   ↓
Publicación de un objeto
   ↓
Realización de una oferta
   ↓
Aceptación de la oferta
   ↓
Finalización de la transacción
   ↓
Valoración del usuario
```

---

## 18. Funcionalidades del MVP

La primera versión del proyecto debería incluir:

* Registro e inicio de sesión.
* Gestión de perfiles.
* Publicación de objetos.
* Edición y eliminación de anuncios.
* Buscador de objetos.
* Filtros por dimensión, precio y rareza.
* Sistema de favoritos.
* Sistema de ofertas.
* Chat entre usuarios.
* Valoraciones.
* Gestión básica de dimensiones.
* Panel de moderación.
* Subida de imágenes.
* Diseño responsive.

---

## 19. Funcionalidades futuras

Como posibles ampliaciones se podrían incluir:

* Conversión automática entre monedas interdimensionales.
* Sistema de subastas.
* Mapas de dimensiones.
* Portales interdimensionales.
* Recomendación personalizada de objetos.
* Inteligencia artificial para generar descripciones.
* Detección automática de contenido prohibido.
* Sistema de logros.
* Misiones diarias.
* Objetos que cambian según la dimensión.
* Eventos temporales.
* Mercado negro interdimensional.
* Sistema de seguros para envíos.
* Simulación de costes de transporte.
* Aplicación móvil.

---

## 20. Arquitecturas que se deberían evitar inicialmente

Para este proyecto no sería recomendable comenzar con:

* Microservicios.
* Kubernetes.
* Event Sourcing completo.
* Kafka.
* RabbitMQ.
* Varias bases de datos.
* Arquitecturas distribuidas complejas.
* Un servicio independiente para cada entidad.
* Infraestructura excesivamente compleja.

Estas tecnologías podrían estudiarse como una evolución futura, pero introducirlas desde el principio aumentaría considerablemente el tiempo y la dificultad del proyecto.

---

## 21. Recomendación final

La arquitectura recomendada para **Wormarket** sería:

```text id="a2gz8v"
Monolito modular
+ Clean Architecture
+ DDD ligero
+ CQRS ligero
+ Eventos de dominio internos
+ PostgreSQL
+ WebSockets para el chat
```

Los módulos iniciales serían:

```text id="ahzzvy"
Identity
Users
Listings
Dimensions
Offers
Conversations
Reviews
Favorites
Moderation
```

Esta arquitectura permite construir una aplicación mantenible, testeable y organizada, al mismo tiempo que evita la sobreingeniería.

También permite demostrar conocimientos de:

* Desarrollo frontend.
* Desarrollo backend.
* Bases de datos.
* Diseño de APIs.
* Arquitectura de software.
* Patrones de diseño.
* Autenticación.
* Comunicación en tiempo real.
* Testing.
* Contenedores.
* Despliegue.
* Diseño de dominio.

Por tanto, se considera una solución adecuada para un Trabajo de Fin de Máster centrado en desarrollo de software.
