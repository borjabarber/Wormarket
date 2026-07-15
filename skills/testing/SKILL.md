---
name: testing
description: Define, implementa y ejecuta pruebas unitarias, de integracion y end-to-end para Wormarket. Usala cuando la tarea requiera validar comportamiento, corregir bugs, cubrir casos de uso, probar componentes frontend, probar controladores NestJS, repositorios Prisma o flujos completos locales.
---

# Objetivo

Validar comportamiento observable con una estrategia de pruebas proporcional al riesgo.

# Cuando utilizarla

- Nueva funcionalidad.
- Correccion de bugs.
- Refactors con riesgo.
- Componentes frontend.
- Casos de uso backend.
- Repositorios y controladores.
- Flujos E2E locales.

# Cuando no utilizarla

- Documentacion sin cambios funcionales, salvo evaluaciones de skills.
- Despliegue sin app local.

# Procedimiento

1. Identifica el comportamiento critico.
2. Elige el nivel minimo suficiente: unitario, integracion o E2E.
3. Prioriza casos felices, errores y permisos.
4. Evita tests acoplados a detalles irrelevantes.
5. Usa datos de prueba claros.
6. Ejecuta las comprobaciones relevantes.
7. Documenta comandos ejecutados y resultados.

# Comprobaciones

- Unitarias para dominio y casos de uso.
- Integracion para API, Prisma y auth.
- E2E para flujos principales.
- Playwright solo cuando exista interfaz ejecutable.

# Resultado esperado

Pruebas utiles, reproducibles y documentadas.
