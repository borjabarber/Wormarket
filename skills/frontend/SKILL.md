---
name: frontend
description: Implementa o modifica paginas, componentes, formularios, estados de carga/error/vacio, hooks y llamadas de API en apps/web para Wormarket con Next.js, React, TypeScript, Tailwind CSS, TanStack Query, React Hook Form y Zod. Usala cuando la tarea toque interfaz visible, rutas frontend, experiencia responsive, copy en espanol o integracion cliente con la API local.
---

# Objetivo

Construir el frontend local de Wormarket con una experiencia clara, responsive, accesible y coherente con el sistema de diseno.

# Cuando utilizarla

- Cambios en `apps/web`.
- Paginas, layouts, componentes o formularios.
- Estados de carga, error y vacio.
- Integracion con la API local.
- Copy visible para usuarios.

# Cuando no utilizarla

- Reglas de dominio backend.
- Migraciones de base de datos.
- Despliegues.
- Seguridad de tokens sin cambios frontend.

# Procedimiento

1. Lee `AGENTS.md`, `TASKS.md`, `DESIGN_SYSTEM.md` y `VISUAL_DIRECTION.md`.
2. Confirma que la fase activa es desarrollo local.
3. Identifica la funcionalidad y sus estados.
4. Usa componentes pequenos y nombres en ingles.
5. Mantiene toda la interfaz en espanol.
6. Valida formularios con Zod y React Hook Form cuando aplique.
7. Usa TanStack Query para datos remotos cuando exista API.
8. Aplica HTML semantico y foco visible.
9. Verifica responsive en movil y escritorio.
10. Anade o ajusta tests segun riesgo.

# Comprobaciones

- TypeScript.
- Linter.
- Tests relevantes.
- Revision visual cuando exista app.
- Navegacion por teclado para flujos tocados.

# Casos limite

- Datos vacios.
- API no disponible.
- Validaciones fallidas.
- Sesion expirada.
- Listas largas.
- Imagenes ausentes.

# Resultado esperado

Una interfaz funcional en local, en espanol, sin secretos, sin URLs fijas de produccion y alineada con el sistema de diseno.
