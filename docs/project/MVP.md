# MVP local de Wormarket

## Objetivo

Construir una plataforma local completa donde usuarios de distintas dimensiones puedan publicar, descubrir, negociar y cerrar transacciones de objetos imposibles.

## Estado actual

Version documental: `0.27.15`.

La fase local ya contiene los modulos principales de backend, las pantallas frontend del flujo principal, seed visual, usuarios demo, pruebas unitarias, integracion y e2e local. La validacion final del flujo completo queda para la siguiente tarea de la fase activa.

## Funcionalidades del MVP local

| Funcionalidad | Estado |
|---|---|
| Registro e inicio de sesion | Implementado |
| Perfil propio y perfiles publicos | Implementado |
| Dimensiones | Implementado |
| Publicacion de objetos | Implementado |
| Edicion de anuncios propios | Implementado |
| Imagenes locales y assets demo | Implementado |
| Busqueda y filtros | Implementado |
| Favoritos | Implementado |
| Ofertas | Implementado |
| Chat local con Socket.IO | Implementado |
| Transacciones | Implementado |
| Valoraciones | Implementado |
| Notificaciones basicas | Implementado |
| Moderacion basica | Implementado |
| Diseno responsive | Revisado |
| Accesibilidad | Revisada |
| Seguridad local | Revisada |
| Rendimiento local | Revisado |
| Datos de demostracion | Implementado |
| Tests unitarios, integracion y e2e local | Implementado |
| Documentacion | En cierre |

## Limitaciones conocidas antes de validar fase local

- La eliminacion directa de anuncios por vendedor no esta expuesta como pantalla principal; el MVP local cubre edicion, estados de anuncio y bloqueo por moderacion.
- No hay pagos reales, envios reales ni confirmaciones externas.
- Las credenciales demo son ficticias y solo sirven para desarrollo local.

## Fuera del MVP

- Pagos reales.
- App movil nativa.
- Microservicios.
- Blockchain o criptomonedas reales.
- IA obligatoria.
- Logistica real.
- Multiidioma.
- Recomendaciones avanzadas.
