# ADR 0002: Usar Prisma con PostgreSQL

## Estado

Aceptada.

## Contexto

Wormarket necesita persistencia relacional para usuarios, anuncios, dimensiones, ofertas, conversaciones, transacciones, valoraciones, favoritos, notificaciones y moderacion.

El proyecto debe demostrar modelado de datos, migraciones, relaciones, restricciones, seed local y preparacion para despliegue posterior. La fase local usara PostgreSQL mediante Docker y la configuracion debera depender de `DATABASE_URL`.

## Decision

Wormarket usara **PostgreSQL** como base de datos relacional y **Prisma** como ORM y herramienta de migraciones.

Durante la fase local:

- PostgreSQL correra mediante Docker Compose.
- Prisma usara `DATABASE_URL`.
- Las migraciones se ejecutaran solo en local.
- El seed generara datos de demostracion reproducibles.

En una fase posterior, la misma abstraccion podra apuntar a PostgreSQL gestionado, sin ejecutar migraciones cloud durante la fase local.

## Alternativas consideradas

- **SQL manual con `pg`:** ofrece control fino, pero aumenta boilerplate y reduce velocidad de desarrollo para el MVP.
- **TypeORM:** encaja con NestJS, pero Prisma ofrece una experiencia mas directa para schema, migraciones y cliente tipado.
- **MongoDB u otra NoSQL:** descartado porque el dominio contiene relaciones claras y el objetivo academico incluye bases de datos relacionales.
- **SQLite local:** descartado porque no representa fielmente el entorno PostgreSQL previsto.

## Consecuencias positivas

- Schema versionado y revisable.
- Migraciones reproducibles.
- Cliente TypeScript tipado.
- Buena integracion con NestJS y tests de repositorio.
- Facil transicion de PostgreSQL local a PostgreSQL gestionado.

## Consecuencias negativas

- El dominio no debe depender de tipos Prisma, lo que exige mappers o repositorios.
- Las migraciones requieren disciplina para evitar cambios destructivos.
- Algunas consultas complejas pueden requerir SQL raw controlado.

## Reglas derivadas

- No exponer entidades Prisma como DTOs publicos.
- Mantener Prisma en infraestructura.
- Usar repositorios o adaptadores para aislar persistencia.
- No ejecutar migraciones contra Supabase u otro servicio cloud durante desarrollo local.
- Registrar cambios relevantes de schema en documentacion y changelog.
