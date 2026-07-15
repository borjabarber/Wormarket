---
name: database
description: Modela y modifica Prisma, PostgreSQL local, migraciones, seed, relaciones, indices, restricciones y adaptadores de persistencia de Wormarket. Usala cuando la tarea cambie schema.prisma, migraciones, consultas, repositorios persistentes, Docker PostgreSQL o datos de demostracion locales.
---

# Objetivo

Mantener una base de datos relacional coherente con el dominio de Wormarket y reproducible en local.

# Cuando utilizarla

- Cambios en Prisma.
- Migraciones locales.
- Seed.
- Indices y restricciones.
- Repositorios con persistencia.
- Docker Compose de PostgreSQL.

# Cuando no utilizarla

- Cambios puramente visuales.
- Despliegue de bases de datos cloud.
- Logica de UI.

# Procedimiento

1. Lee `DATABASE.md` si existe y arquitectura relacionada.
2. Modela desde el dominio, no desde pantallas aisladas.
3. Usa `DATABASE_URL`.
4. Evita datos duplicados sin justificacion.
5. Define relaciones y borrados explicitamente.
6. Anade indices para busquedas previstas.
7. Mantiene seed idempotente cuando sea razonable.
8. No ejecutes migraciones en servicios cloud durante fase local.

# Comprobaciones

- `npm run db:generate` cuando exista.
- `npm run db:migrate` cuando exista.
- Tests de repositorio cuando existan.
- Revision de datos sensibles.

# Resultado esperado

Persistencia local reproducible y coherente con el modelo de dominio.
