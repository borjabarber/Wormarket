# @wormarket/typescript-config

Configuraciones TypeScript compartidas para Wormarket.

## Configuraciones

- `base.json`: reglas estrictas comunes para todo el monorepo.
- `next.json`: base para aplicaciones Next.js.
- `nest.json`: base para aplicaciones NestJS.
- `library.json`: base para paquetes TypeScript compartidos.

La configuracion base mantiene `strict: true` y activa comprobaciones adicionales como `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitReturns`, `noImplicitOverride` y `useUnknownInCatchVariables`.
