# Sistema de diseno

## Objetivo

Crear una interfaz coherente, accesible y responsive para Wormarket.

## Tokens actuales

El frontend actual usa CSS propio con tokens conceptuales documentados. Tailwind sigue siendo tecnologia objetivo del prompt maestro, pero no se fuerza en esta tarea documental.

| Token | Valor | Uso |
|---|---|---|
| `space-1` | `0.25rem` | Separacion minima |
| `space-2` | `0.5rem` | Controles compactos |
| `space-4` | `1rem` | Separacion base |
| `space-6` | `1.5rem` | Bloques |
| `radius-sm` | `0.25rem` | Inputs |
| `radius-md` | `0.5rem` | Cards y botones |

## Componentes implementados y previstos

- Navegacion principal implementada en el layout raiz.
- Busqueda principal en cabecera.
- Toggle `Dimension oscura` / `Dimension luminosa`.
- Banner editorial de home con imagen lifestyle.
- Boton reutilizable con variantes `primary`, `secondary` y `ghost`.
- Campos `Input`, `Select` y `Textarea` con label, ayuda y error asociado.
- Card de anuncio con rareza, dimension, precio y accion.
- Ficha de detalle de anuncio.
- Formulario de creacion y edicion de anuncios.
- Boton de favoritos.
- Formularios y paneles de ofertas.
- Pantallas de conversaciones, transacciones, notificaciones y moderacion.
- Badge de rareza para `COMMON`, `RARE`, `EPIC`, `LEGENDARY` y `FORBIDDEN`.
- Estado vacio con accion opcional.
- Skeleton accesible para estados de carga.
- Dialogo y toast pendientes para tareas posteriores.

## Accesibilidad

- Foco visible.
- Labels explicitos.
- Estados de error asociados.
- Contraste AA.
- Targets tactiles de al menos 24 px.
- Texto alternativo para imagenes.
