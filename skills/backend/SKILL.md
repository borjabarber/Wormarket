---
name: backend
description: Implementa o modifica modulos NestJS, controladores REST, casos de uso, DTOs, mappers, errores, servicios de aplicacion y adaptadores en apps/api para Wormarket. Usala cuando la tarea toque API, dominio backend, autenticacion, autorizacion, Socket.IO local o integracion con Prisma sin ejecutar tareas de despliegue.
---

# Objetivo

Construir el backend de Wormarket como monolito modular con Clean Architecture y DDD ligero.

# Cuando utilizarla

- Cambios en `apps/api`.
- Modulos NestJS.
- Controladores, gateways o providers.
- Casos de uso.
- Errores de dominio y aplicacion.
- Integracion con repositorios y adaptadores.

# Cuando no utilizarla

- Diseno visual.
- Cambios exclusivamente de CSS.
- Migraciones complejas sin usar la skill `database`.
- Despliegue.

# Procedimiento

1. Lee arquitectura y modulo afectado.
2. Mantiene controladores pequenos.
3. Coloca reglas de negocio en dominio o casos de uso.
4. Define DTOs de entrada/salida.
5. Valida entradas en el borde.
6. No expongas modelos Prisma directamente.
7. Usa errores consistentes con codigos internos en ingles y mensajes visibles en espanol.
8. Aplica autorizacion por rol o propietario cuando corresponda.
9. Anade tests unitarios o de integracion segun riesgo.

# Comprobaciones

- TypeScript.
- Linter.
- Tests unitarios y de integracion relevantes.
- Respuestas HTTP correctas.
- Sin secretos ni trazas internas.

# Resultado esperado

API local mantenible, testeable, segura y alineada con la arquitectura.
