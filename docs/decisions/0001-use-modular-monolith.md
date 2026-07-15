# ADR 0001: Usar monolito modular con Clean Architecture

## Estado

Aceptada.

## Contexto

Wormarket debe demostrar arquitectura profesional dentro de un Trabajo de Fin de Master, pero el MVP local debe ser viable, mantenible y comprobable sin introducir una complejidad operativa excesiva.

El producto necesita cubrir varias areas funcionales: identidad, usuarios, dimensiones, anuncios, favoritos, ofertas, transacciones, conversaciones, valoraciones, notificaciones y moderacion. Estas areas tienen reglas propias, pero forman parte de un unico producto y deben evolucionar juntas durante la fase local.

La fase activa es `Desarrollo local`, por lo que no deben introducirse servicios distribuidos ni infraestructura cloud.

## Decision

Wormarket se construira como un **monolito modular** aplicando **Clean Architecture** y **DDD ligero**.

El backend vivira en `apps/api` y se organizara por modulos funcionales. Cada modulo separara dominio, aplicacion, infraestructura y presentacion cuando la complejidad lo justifique.

La regla de dependencias sera:

```text
Presentation -> Application -> Domain
Infrastructure -> Application -> Domain
```

El dominio no dependera de NestJS, Prisma, PostgreSQL, HTTP, Socket.IO ni servicios externos.

## Alternativas consideradas

- **Microservicios:** descartados porque anaden despliegues, comunicacion distribuida, observabilidad y coordinacion innecesarias para el MVP.
- **Aplicacion por capas globales:** descartada porque puede mezclar responsabilidades y dificultar localizar reglas por funcionalidad.
- **Arquitectura sin capas formales:** descartada porque limita la demostracion academica de diseno, testing y mantenibilidad.

## Consecuencias positivas

- Permite trabajar por modulos sin desplegar multiples servicios.
- Facilita pruebas unitarias de dominio y casos de uso.
- Mantiene las reglas de negocio fuera de controladores y detalles de infraestructura.
- Prepara el proyecto para un despliegue posterior sin adelantarlo.
- Reduce la sobreingenieria frente a microservicios.

## Consecuencias negativas

- Requiere disciplina para no crear dependencias cruzadas entre modulos.
- Puede parecer mas estructurado que un CRUD simple.
- Obliga a documentar claramente limites y responsabilidades.

## Reglas derivadas

- No colocar reglas de negocio en controladores.
- No exponer modelos internos de Prisma directamente en respuestas publicas.
- No crear microservicios durante el MVP.
- Documentar cualquier excepcion arquitectonica relevante en un ADR.
