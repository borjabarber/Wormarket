# Supabase Storage

## Objetivo

Configurar las subidas de imagenes de Wormarket para produccion usando Supabase Storage, sin guardar claves reales en el repositorio.

## Variables

El backend activa este adaptador con:

```env
STORAGE_DRIVER=supabase
SUPABASE_URL=<url publica del proyecto Supabase>
SUPABASE_SERVICE_ROLE_KEY=<service role key, solo servidor>
SUPABASE_STORAGE_BUCKET=wormarket-listing-images
```

`SUPABASE_SERVICE_ROLE_KEY` es secreto de servidor. No debe usarse en el frontend, no debe tener prefijo `NEXT_PUBLIC_` y no debe pegarse en documentacion, commits ni conversaciones.

## Bucket

Para que las imagenes publicas de anuncios se vean en el marketplace, el bucket previsto es:

```text
wormarket-listing-images
```

Configuracion recomendada en Supabase:

- Bucket publico.
- Nombre exacto `wormarket-listing-images`.
- Limite funcional de Wormarket: JPG, PNG, WebP o GIF hasta 2 MB por imagen.

El backend guarda las imagenes bajo el prefijo `listings/` y devuelve la URL publica generada por Supabase.

## Flujo de subida

1. El usuario autenticado sube una imagen mediante `POST /storage/uploads`.
2. El backend valida tipo MIME, tamano y firma real del archivo.
3. Si `STORAGE_DRIVER=local`, se guarda en `uploads/`.
4. Si `STORAGE_DRIVER=supabase`, se guarda en Supabase Storage.
5. La respuesta devuelve `url` y `path` con la URL publica que se usara en el anuncio.

## Referencias oficiales

- Supabase Storage: `https://supabase.com/docs/guides/storage`
- Upload con JavaScript: `https://supabase.com/docs/reference/javascript/storage-from-upload`
- URL publica con JavaScript: `https://supabase.com/docs/reference/javascript/storage-from-getpublicurl`
