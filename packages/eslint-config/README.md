# @wormarket/eslint-config

Configuracion compartida de ESLint para Wormarket.

## Uso

La raiz del monorepo carga esta configuracion desde `eslint.config.mjs`.

Incluye:

- ESLint recomendado.
- Reglas recomendadas de TypeScript.
- Reglas basicas para React, React Hooks, accesibilidad JSX y Next.js.
- Compatibilidad con Prettier mediante `eslint-config-prettier`.

## Comandos

```bash
npm run lint
npm run format
npm run format:write
```
