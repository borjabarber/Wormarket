# Versioning

Wormarket usa SemVer adaptado al avance academico del proyecto.

La version publica del proyecto se gestiona desde la raiz del monorepo. Las versiones internas de workspaces pueden permanecer en `0.1.0` mientras no se publiquen como paquetes independientes.

Formato:

```text
MAJOR.MINOR.PATCH
```

## Reglas

- `0.1.0`: preparacion inicial del proyecto, documentacion base e inventario de skills.
- Incrementa `PATCH` para correcciones documentales, revisiones de control del proyecto, ajustes pequenos, correcciones de bugs o mejoras locales sin nueva capacidad completa.
- Incrementa `MINOR` para nuevas capacidades completas en fase local: modulo backend, pantalla frontend, flujo de usuario, integracion relevante, almacenamiento, pruebas e2e o una mejora funcional completa del MVP.
- Incrementa `MAJOR` para el cierre del MVP estable, el paso a una version final demostrable o un cambio incompatible relevante.
- Durante `Desarrollo local`, las versiones `0.x.y` siguen representando avance incremental del MVP.
- La version `1.0.0` queda reservada para el cierre estable del MVP o la fase de despliegue aprobada explicitamente.
- No se debe subir a `1.0.0`, crear tags ni publicar releases solo por completar una tarea documental.

## Archivos que deben quedar sincronizados

Cuando se actualice la version raiz, revisa y sincroniza:

- `package.json`
- `package-lock.json`
- `README.md`
- `docs/project/VERSIONING.md`
- `docs/project/CHANGELOG.md`
- `docs/project/WORK_LOG.md`

`docs/project/TASKS.md` debe marcar la tarea completada solo si la version y los documentos asociados ya estan coherentes.

## Changelog por version

- Toda version publicada en `VERSIONING.md` debe tener entrada en `docs/project/CHANGELOG.md`.
- La seccion `[Unreleased]` debe permanecer arriba para cambios aun no versionados.
- Las entradas deben mantener orden descendente por version y fecha.
- No mezclar cambios acumulados de muchas versiones dentro de una entrada concreta.

## Cierre de fase local

Antes de cerrar la fase local:

- El changelog debe estar revisado.
- `VERSIONING.md` debe reflejar la version local vigente.
- La version final local debe estar documentada en `README.md`, `CHANGELOG.md`, `VERSIONING.md` y `WORK_LOG.md`.
- El paso a `1.0.0` requiere aprobacion explicita del usuario.

## Version actual

`1.0.1`

## Tags y releases

No crear tags ni releases sin permiso explicito del usuario.

## Changelog

Todo cambio relevante debe registrarse en `docs/project/CHANGELOG.md`.
