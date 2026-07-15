# Componentes

Catalogo inicial de componentes previstos para Wormarket.

| Componente | Uso | Estado |
|---|---|---|
| `RootLayout` | Estructura persistente con skip link, header, navegacion principal, main y footer | Implementado inicial |
| `SiteNavigation` | Navegacion principal responsive dentro de `RootLayout` | Implementado inicial |
| `SiteSearch` | Busqueda principal en cabecera orientada a explorar objetos | Implementado inicial |
| `AuthNavAction` | Accion de cabecera que muestra `Inicia sesion` sin sesion y `Cerrar sesion` con sesion activa | Implementado inicial |
| `ThemeToggle` | Control de cabecera para alternar entre `Dimension oscura` y `Dimension luminosa`, persistiendo la preferencia local | Implementado inicial |
| `HomeBanner` | Banner editorial de la home con imagen lifestyle y CTAs de exploracion y venta | Implementado inicial |
| `Button` | Acciones principales, secundarias y discretas | Implementado inicial |
| `Input` | Campos de texto en formularios con label, ayuda y error asociado | Implementado inicial |
| `Select` | Filtros y formularios con label, ayuda y error asociado | Implementado inicial |
| `Textarea` | Campos largos de formulario con label, ayuda y error asociado | Implementado inicial |
| `ListingCard` | Vista resumida de anuncio con rareza, dimension y precio | Implementado inicial |
| `ListingDetail` | Ficha de anuncio conectada a API local con estados de carga/error/no encontrado | Implementado inicial |
| `ListingForm` | Creacion y edicion de anuncios propios con validacion, dimensiones, rareza, precio e imagenes | Implementado inicial |
| `ListingsExplorer` | Explorador conectado a API local con busqueda, filtros y estados de carga/error/vacio | Implementado inicial |
| `FavoriteButton` | Accion autenticada para guardar o quitar anuncios favoritos desde cards y detalle | Implementado inicial |
| `FavoritesPage` | Pantalla de favoritos conectada a API local con listado, carga, error, vacio y acceso a autenticacion | Implementado inicial |
| `OfferForm` | Formulario autenticado para enviar ofertas desde el detalle de un anuncio publicado ajeno | Implementado inicial |
| `ListingOffersPanel` | Panel del vendedor para revisar, aceptar o rechazar ofertas recibidas en un anuncio propio | Implementado inicial |
| `OffersPage` | Pantalla de ofertas enviadas conectada a API local con listado, carga, error, vacio y cancelacion | Implementado inicial |
| `StartConversationButton` | Accion autenticada para crear o abrir una conversacion desde el detalle de un anuncio ajeno | Implementado inicial |
| `ConversationsPage` | Pantalla de conversaciones conectada a API local con listado, carga, error, vacio y no autenticado | Implementado inicial |
| `ConversationThread` | Hilo de chat con mensajes, envio validado y conexion Socket.IO local para actualizaciones | Implementado inicial |
| `UserProfilePage` | Pantalla de perfil propio y publico con bio, dimension, reputacion, rol, estado y errores de carga | Implementado inicial |
| `ReviewsPanel` | Panel de valoraciones recibidas dentro del perfil publico o propio | Implementado inicial |
| `TransactionsPage` | Pantalla autenticada para listar transacciones, completarlas y valorar al otro participante | Implementado inicial |
| `ReviewForm` | Formulario validado para enviar valoraciones de transacciones completadas | Implementado inicial |
| `NotificationsPage` | Pantalla autenticada de notificaciones con contador, marcado de lectura y Socket.IO local | Implementado inicial |
| `ReportForm` | Formulario autenticado para denunciar anuncios o usuarios desde detalle y perfil publico | Implementado inicial |
| `ModerationPage` | Cola de moderacion para moderadores/admin con resolucion, descarte y bloqueo de objetivos | Implementado inicial |
| `RarityBadge` | Rareza del objeto | Implementado inicial |
| `EmptyState` | Estados sin datos con accion opcional | Implementado inicial |
| `Skeleton` | Estados de carga accesibles | Implementado inicial |
| `Dialog` | Confirmaciones | Pendiente |
| `Toast` | Mensajes no bloqueantes | Pendiente |
