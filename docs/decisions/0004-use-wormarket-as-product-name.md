# ADR 0004: Usar Wormarket como nombre oficial

## Estado

Aceptada.

## Contexto

El proyecto necesita un nombre unico y estable para documentacion, codigo, variables, ejemplos y presentacion del TFM.

## Decision

El nombre oficial del proyecto es **Wormarket**.

El nombre combina la idea de `wormhole` y `market`, y comunica un marketplace conectado por dimensiones, portales y objetos imposibles.

## Alternativas

- Mantener un nombre generico de marketplace.
- Usar un nombre descriptivo pero menos memorable.

## Consecuencias

- La documentacion debe usar Wormarket de forma consistente.
- El `package.json` raiz usa `"name": "wormarket"`.
- Los ejemplos locales usan usuarios, base de datos y servicios con prefijo `wormarket`.
- Las referencias historicas pueden mantenerse solo cuando documenten decisiones pasadas.
