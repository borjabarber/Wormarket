# Estrategia realtime para Vercel

## Decision

Para el primer despliegue gratuito de Wormarket en Vercel + Supabase, la estrategia oficial es:

```text
Desarrollo local     -> Socket.IO actual
Produccion inicial   -> Polling REST con TanStack Query
Evolucion posterior  -> Supabase Realtime, si aporta valor antes de la demo final
```

No se mantiene Socket.IO como requisito de produccion para la primera publicacion.

## Contexto

Wormarket usa realtime local en dos zonas:

- Chat: `conversations`, con eventos `conversation:join`, `message:send`, `message:sent` y `message:read`.
- Notificaciones: `notifications`, con eventos `notifications:join` y `notification:new`.

Ambos flujos ya tienen endpoints REST funcionales:

- `GET /conversations`
- `GET /conversations/:conversationId/messages`
- `POST /conversations/:conversationId/messages`
- `POST /conversations/:conversationId/read`
- `GET /notifications`
- `GET /notifications/unread-count`
- `POST /notifications/:notificationId/read`
- `POST /notifications/read-all`

Esto permite una degradacion simple a polling sin perder funcionalidad esencial del marketplace.

## Fuentes oficiales revisadas

- Vercel WebSockets: `https://vercel.com/docs/functions/websockets`
- Vercel WebSocket support: `https://vercel.com/kb/guide/do-vercel-serverless-functions-support-websocket-connections`
- Supabase Realtime: `https://supabase.com/docs/guides/realtime`
- Supabase Realtime Postgres Changes: `https://supabase.com/docs/guides/realtime/postgres-changes`
- Supabase Realtime Broadcast: `https://supabase.com/docs/guides/realtime/broadcast`

## Opciones evaluadas

### Opcion A: Socket.IO en Vercel Functions

Ventajas:

- Mantiene el modelo local actual.
- Vercel documenta soporte WebSocket en Functions.

Riesgos:

- WebSockets en Vercel Functions estan en beta.
- Las conexiones quedan ligadas a una instancia de Function y se cierran al llegar a la duracion maxima.
- Nuevas conexiones no garantizan llegar a la misma instancia.
- El estado durable, salas y coordinacion entre instancias requieren almacenamiento externo.
- Para Wormarket implicaria adaptar NestJS/Socket.IO al modelo serverless antes incluso de publicar.

Decision: descartada para el primer despliegue gratuito.

### Opcion B: Supabase Realtime

Ventajas:

- Encaja con el proveedor ya elegido.
- Permite Broadcast, Presence y cambios de Postgres.
- Evita mantener Socket.IO propio en Vercel.

Riesgos:

- Requiere disenar permisos y canales con cuidado.
- Postgres Changes exige publicaciones y RLS adecuadas.
- Broadcast privado requiere autenticacion y convenciones de topics.
- Puede distraer de la publicacion inicial si se implementa antes de tener la API en Vercel.

Decision: candidata posterior, no bloquea el primer despliegue.

### Opcion C: Polling REST

Ventajas:

- Coste `0`.
- Encaja con Vercel serverless sin WebSockets.
- Usa endpoints existentes y TanStack Query.
- Suficiente para demo TFM: chat y notificaciones se actualizan cada pocos segundos.
- Menor riesgo tecnico que adaptar Socket.IO o introducir Supabase Realtime ahora.

Riesgos:

- No es tiempo real estricto.
- Genera mas peticiones que WebSocket, aunque el volumen demo es bajo.
- Necesita ajustar intervalos para no gastar cuota innecesaria.

Decision: elegida para produccion inicial.

## Politica de producto

El usuario no debe notar una funcionalidad rota en produccion:

- Chat: refresco periodico de mensajes mientras la conversacion esta abierta.
- Lista de conversaciones: refresco periodico moderado cuando la pagina esta activa.
- Notificaciones: refresco periodico de lista y contador mientras la pagina esta activa.
- Acciones manuales siguen invalidando cache inmediatamente tras enviar mensaje, marcar como leido o marcar todas.

Intervalos recomendados:

```text
Mensajes de conversacion abierta: 5 segundos
Lista de conversaciones: 15 segundos
Notificaciones y contador: 15 segundos
```

TanStack Query debe pausar o reducir polling cuando la pestana no esta enfocada, salvo que se decida lo contrario para la demo.

## Variables previstas

Para no mezclar local y produccion, se recomienda introducir una variable publica en la tarea de implementacion:

```env
NEXT_PUBLIC_REALTIME_MODE=polling
```

Valores previstos:

- `socket`: usar Socket.IO local.
- `polling`: usar refetch periodico REST.
- `off`: sin actualizacion automatica, solo acciones manuales.

En local, el valor por defecto puede seguir siendo `socket`. En Vercel, el valor recomendado sera `polling`.

## Impacto en tareas siguientes

La siguiente tarea, `Preparar API para Vercel/serverless`, debe asumir que:

- Socket.IO no bloquea el despliegue inicial.
- Los endpoints REST de chat y notificaciones son la fuente de verdad.
- La API serverless no necesita mantener conexiones persistentes.
- El frontend debera activar polling cuando `NEXT_PUBLIC_REALTIME_MODE=polling`.

## Criterio de aceptacion futuro

Antes de desplegar:

- La app debe funcionar con `NEXT_PUBLIC_REALTIME_MODE=polling`.
- Chat debe recibir mensajes nuevos tras refresco periodico.
- Notificaciones y contador deben actualizarse tras refresco periodico.
- Socket.IO puede seguir existiendo para desarrollo local, pero no debe ser necesario para la URL publica.
