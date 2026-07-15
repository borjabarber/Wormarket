# Pantallas

Pantallas previstas para el MVP local.

- Inicio / explorador de anuncios conectado a `GET /listings`, con busqueda y filtros por dimension, rareza y estado.
- Registro e inicio de sesion en `/auth` con estado de sesion local.
- Perfil en `/profile` con sesion local y perfil publico en `/users/:username`.
- Crear anuncio en `/listings/new`, con sesion local, validacion, seleccion de dimension, rareza, precio e imagenes.
- Editar anuncio en `/listings/:slug/edit`, restringido al vendedor autenticado.
- Detalle de anuncio en `/listings/:slug`, conectado a `GET /listings/:slug`, con imagen o placeholder, precio, rareza, estado, descripcion, dimension, fecha, vendedor, formulario de oferta para compradores, accion de chat y panel de ofertas recibidas para el vendedor.
- Favoritos en `/favorites`, con sesion local, listado de anuncios guardados, estado vacio y retirada de favoritos.
- Ofertas en `/offers`, con sesion local, listado de ofertas enviadas, estado vacio y cancelacion de ofertas pendientes.
- Conversaciones en `/conversations`, con sesion local, listado de chats, estado vacio y detalle en `/conversations/:conversationId` con mensajes y envio.
- Transacciones y valoraciones en `/transactions`, con sesion local, completado de transacciones y formulario de valoracion.
- Notificaciones en `/notifications`, con sesion local, contador de no leidas, marcado individual, marcado masivo y actualizacion Socket.IO local.
- Panel de moderacion en `/moderation`, con acceso restringido a moderadores/admin, cola de denuncias, resolucion, descarte y bloqueo de anuncios o usuarios.
