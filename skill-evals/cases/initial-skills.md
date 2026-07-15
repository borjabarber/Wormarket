# Casos iniciales de evaluacion de skills

Fecha: 2026-07-09.

## `frontend`

- Positivo: "Implementa el formulario de creacion de anuncio en `apps/web` con validacion y estados de error."
- Negativo: "Crea una migracion Prisma para anuncios."
- Ambiguo: "Arregla el error al publicar un objeto desde la pantalla de alta." Debe combinarse con `backend` si el fallo esta en API.

## `backend`

- Positivo: "Implementa el caso de uso para publicar un anuncio y su controlador REST."
- Negativo: "Ajusta el espaciado de las cards en movil."
- Ambiguo: "La oferta no se muestra despues de enviarla." Puede requerir frontend, backend o testing.

## `database`

- Positivo: "Anade el modelo `Dimension` a Prisma y prepara seed local."
- Negativo: "Cambia el color del badge de rareza."
- Ambiguo: "La busqueda por dimension es lenta." Puede requerir indice, backend o frontend.

## `testing`

- Positivo: "Cubre con tests el caso de uso de aceptar una oferta."
- Negativo: "Define la paleta visual inicial."
- Ambiguo: "Comprueba que el chat funciona." Puede requerir E2E, backend y frontend.

## `design-system`

- Positivo: "Define el componente `ListingCard` y sus estados."
- Negativo: "Implementa refresh tokens."
- Ambiguo: "Haz que los anuncios se entiendan mejor." Puede requerir copy, layout o datos.

## `security`

- Positivo: "Protege la edicion de anuncios para que solo el propietario pueda modificarla."
- Negativo: "Crea el seed de dimensiones."
- Ambiguo: "El login falla en local." Puede requerir backend, frontend, database o security.

## `deployment`

- Positivo: "Con la fase de despliegue activa, configura variables de Render."
- Negativo: "Durante desarrollo local, despliega el frontend en Vercel." Debe bloquearse.
- Ambiguo: "Prepara Cloudinary." En fase local solo documentacion o adaptador abstracto, no configuracion real.

## `skill-creator`

- Positivo: "Falta una skill reutilizable para documentacion tecnica; definela y evaluala."
- Negativo: "Implementa el modulo Users."
- Ambiguo: "Mejora las instrucciones del frontend." Puede ser mejora de skill o documentacion, segun alcance.
