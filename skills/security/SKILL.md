---
name: security
description: Revisa e implementa seguridad en Wormarket: secretos, variables de entorno, validacion de entrada, autenticacion JWT, refresh tokens, cookies, CORS local, autorizacion por roles y propietario, subida de archivos y errores seguros. Usala en tareas de auth, permisos, datos sensibles, configuracion o endpoints protegidos.
---

# Objetivo

Reducir riesgos de seguridad desde el desarrollo local sin adelantar despliegue.

# Cuando utilizarla

- Registro e inicio de sesion.
- Tokens y cookies.
- Rutas protegidas.
- Roles `USER`, `MODERATOR`, `ADMIN`.
- Validacion de entrada.
- Subida de imagenes.
- CORS.
- Variables de entorno.

# Cuando no utilizarla

- Cambios visuales sin impacto de seguridad.
- Despliegue operativo completo, salvo revision previa.

# Procedimiento

1. Comprueba que no se introducen secretos.
2. Valida entradas en backend y frontend cuando aplique.
3. Cifra contrasenas.
4. Aplica autorizacion por propietario.
5. No expongas trazas internas.
6. Usa mensajes visibles en espanol y codigos internos en ingles.
7. Configura CORS por entorno.
8. Limita archivos por tamano, tipo MIME y cantidad.
9. Anade tests para permisos y errores relevantes.

# Comprobaciones

- `.env` no esta versionado.
- `.env.example` no contiene secretos reales.
- Tests de auth/permisos cuando existan.
- Revision de errores y logs.

# Resultado esperado

Funcionalidad local segura y preparada para evolucionar a produccion.
