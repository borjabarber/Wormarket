# Flujos de usuario

## Flujo principal local

```text
Registro
  -> inicio de sesion
  -> sesion local activa
  -> publicar objeto en /listings/new
  -> buscar anuncio con filtros locales
  -> guardar favoritos si procede
  -> revisar detalle del anuncio
  -> editar anuncio propio si procede
  -> crear oferta
  -> aceptar oferta
  -> chatear
  -> completar transaccion
  -> valorar usuario
```

## Flujos secundarios

- Guardar o retirar favoritos desde el explorador, el detalle o `/favorites`.
- Enviar oferta desde el detalle de un anuncio publicado ajeno y revisarla en `/offers`.
- Cancelar ofertas pendientes desde `/offers`.
- Aceptar o rechazar ofertas recibidas desde el detalle del anuncio propio.
- Abrir una conversacion desde el detalle de un anuncio ajeno y continuar el hilo en `/conversations/:conversationId`.
- Revisar conversaciones activas desde `/conversations`.
- Revisar perfil propio y consultar perfiles publicos de vendedores.
- Completar transacciones y valorar al otro participante desde `/transactions`.
- Revisar notificaciones desde `/notifications`, abrir enlaces relacionados y marcar actividad como leida.
- Modificar anuncio propio desde `/listings/:slug/edit`.
- Denunciar anuncio desde el detalle o usuario desde perfil publico.
- Revisar denuncias en `/moderation` con rol moderador/admin, resolverlas, descartarlas o bloquear el objetivo.
