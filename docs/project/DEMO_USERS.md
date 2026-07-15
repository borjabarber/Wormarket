# Demo Users

Usuarios locales de demostracion para Wormarket.

Estas credenciales son ficticias y solo deben usarse en desarrollo local. No son secretos reales, no deben reutilizarse en produccion y pueden regenerarse con:

```bash
npm run db:seed
```

## Credenciales

Todos los usuarios demo usan la misma contrasena local:

```text
WormarketDemo123!
```

| Proposito | Usuario | Email de login | Rol | Uso recomendado |
|---|---|---|---|---|
| Vendedor | `lyra-oraculo` | `vendedor@demo.wormarket.local` | `USER` | Publicar y gestionar anuncios propios, recibir ofertas y conversar con compradores. |
| Comprador | `nadir-cronal` | `comprador@demo.wormarket.local` | `USER` | Probar favoritos, ofertas, transacciones completadas y valoraciones. |
| Otro comprador | `vega-umbral` | `comprador2@demo.wormarket.local` | `USER` | Probar una segunda perspectiva de comprador sin mezclar estado con Nadir. |
| Moderador | `io-horizonte` | `moderador@demo.wormarket.local` | `MODERATOR` | Revisar cola de denuncias y acciones de moderacion permitidas. |
| Admin | `zerodev` | `zerodev@demo.wormarket.local` | `ADMIN` | Probar permisos administrativos y acciones de moderacion avanzadas. |
| General | `braismoure` | `braismoure@demo.wormarket.local` | `USER` | Recorrer el flujo general del marketplace: explorar, favoritos, ofertas, chat y perfil. |

## Avatares

Los perfiles demo usan avatares ficticios versionados en `apps/web/public/images/demo/users/`:

- `lyra-oraculo.png`
- `nadir-cronal.png`
- `vega-umbral.png`
- `io-horizonte.png`
- `zerodev.png`
- `braismoure.png`

Son imagenes generadas para desarrollo local. No representan personas reales ni deben tratarse como identidad real de ningun usuario.

## Notas

- El login de la aplicacion usa email y contrasena, no el nombre de usuario.
- El seed crea perfiles publicos e identidades autenticables mediante `IdentityAccount`.
- Las contrasenas se almacenan en base de datos como hash PBKDF2 usando el hasher local de Identity.
- El seed es idempotente para perfiles, cuentas, anuncios, favoritos, ofertas, conversaciones, valoraciones, notificaciones y denuncias.
