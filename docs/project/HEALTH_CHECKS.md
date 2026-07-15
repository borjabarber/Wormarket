# Health checks

Wormarket expone health checks publicos bajo la API para validar el despliegue de Vercel sin revelar secretos ni detalles internos.

## Endpoints

```text
GET /api/health
GET /api/health/live
GET /api/health/ready
```

En local, los mismos endpoints viven sin el prefijo `/api`:

```text
GET /health
GET /health/live
GET /health/ready
```

## Liveness

`GET /health` y `GET /health/live` comprueban que la API responde. No consultan PostgreSQL, por lo que son rapidos y adecuados para saber si la funcion serverless arranca.

Respuesta esperada:

```json
{
  "checks": {
    "api": "ok"
  },
  "status": "ok",
  "service": "wormarket-api",
  "timestamp": "2026-07-15T00:00:00.000Z"
}
```

## Readiness

`GET /health/ready` comprueba que la API puede consultar PostgreSQL con una consulta ligera.

Respuesta esperada cuando la aplicacion esta lista:

```json
{
  "checks": {
    "api": "ok",
    "database": "ok"
  },
  "status": "ok",
  "service": "wormarket-api",
  "timestamp": "2026-07-15T00:00:00.000Z"
}
```

Si PostgreSQL no responde, devuelve `503` con un payload seguro:

```json
{
  "checks": {
    "api": "ok",
    "database": "error"
  },
  "status": "error",
  "service": "wormarket-api",
  "timestamp": "2026-07-15T00:00:00.000Z"
}
```

No se devuelven cadenas de conexion, errores internos ni trazas.

## Comprobacion publica

Tras desplegar en Vercel:

```bash
npm run health:public
```

Por defecto valida `https://wormarket.vercel.app`. Para otra URL:

```bash
PUBLIC_BASE_URL=https://tu-url.vercel.app npm run health:public
```

En Windows `cmd.exe`:

```cmd
set PUBLIC_BASE_URL=https://tu-url.vercel.app
npm run health:public
```

## Criterio de aceptacion

- `/api/health` responde `200`.
- `/api/health/live` responde `200`.
- `/api/health/ready` responde `200` y `database: ok`.
- Si la base cae, readiness responde `503` sin filtrar secretos.
