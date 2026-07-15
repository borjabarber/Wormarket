# ADR 0003: Usar adaptador local de almacenamiento durante la fase local

## Estado

Aceptada.

## Contexto

Wormarket necesita imagenes para los anuncios, pero la fase activa es `Desarrollo local`. El prompt maestro bloquea configurar Cloudinary, Supabase Storage u otros servicios de produccion hasta que la fase local este completada y aprobada.

Aun asi, el codigo debe quedar preparado para sustituir el almacenamiento local por un proveedor externo en la fase de despliegue.

## Decision

Durante la fase local, Wormarket usara un **adaptador local de almacenamiento** para imagenes y archivos de demostracion.

La aplicacion dependera de una interfaz o puerto de almacenamiento, no de un proveedor concreto.

Configuracion prevista:

```env
STORAGE_DRIVER=local
LOCAL_UPLOAD_PATH=uploads
```

Cloudinary quedara documentado como adaptador futuro, pero sus credenciales permaneceran vacias en `.env.example` y no se configurara ningun servicio real durante desarrollo local.

## Alternativas consideradas

- **Cloudinary desde el inicio:** descartado porque adelanta despliegue y requiere credenciales reales.
- **Guardar imagenes como blobs en PostgreSQL:** descartado porque complica base de datos, backups y rendimiento.
- **Usar solo URLs externas de ejemplo:** descartado porque no valida el flujo real de subida local.
- **No implementar abstraccion:** descartado porque dificultaria cambiar a Cloudinary en fase de despliegue.

## Consecuencias positivas

- Permite probar subida y visualizacion de imagenes sin servicios externos.
- Mantiene secretos fuera del repositorio.
- Facilita sustituir el driver local por Cloudinary posteriormente.
- Refuerza la separacion entre dominio, aplicacion e infraestructura.

## Consecuencias negativas

- El almacenamiento local no replica CDN, optimizacion ni transformaciones de Cloudinary.
- Requiere limpiar o ignorar directorios locales como `uploads/`.
- La validacion de archivos debe implementarse igualmente para no posponer seguridad.

## Reglas derivadas

- No guardar archivos subidos en Git.
- Validar tamano, tipo MIME y numero maximo de imagenes.
- No hardcodear rutas absolutas.
- Usar `STORAGE_DRIVER` para elegir adaptador.
- Mantener credenciales cloud vacias durante fase local.
