# Container Registry: GitHub Container Registry (GHCR)

Se incluye workflow `.github/workflows/publicar-imagenes.yml` para publicar 3 imágenes.
No se ejecuta solo por descargar el ZIP: debes integrar y subir archivos a `main`.

## Publicar

1. Verificar que `frontend-angular` esté completo, con `package-lock.json`.
2. Hacer push a `main` (o disparar Actions > Construir y publicar imagenes Docker en GHCR > Run workflow).
3. Ir a GitHub > Actions y revisar el resultado de los trabajos `frontend`, `usuarios`, `foro`.
4. Revisar **Packages** del usuario GitHub; los nombres esperados son:
   - `ghcr.io/crisvg2910/foro-fullstack3-frontend:latest`
   - `ghcr.io/crisvg2910/foro-fullstack3-usuarios:latest`
   - `ghcr.io/crisvg2910/foro-fullstack3-foro:latest`

Si un package es privado, la VM necesita autenticarse en GHCR con token que tenga el
permiso de lectura adecuado. No publiques tokens en el repositorio. Puedes configurar
los paquetes para lectura pública si la política del curso lo permite.

## Ejecución desde el Registry en una VM

Subir de manera privada a la VM los archivos `compose.cloud.yaml`, `.env` y `wallet/`
(con protección adecuada). Las imágenes se obtienen desde GHCR:

```bash
docker compose -f compose.cloud.yaml config --quiet
docker compose -f compose.cloud.yaml pull
docker compose -f compose.cloud.yaml up -d --no-build
docker compose -f compose.cloud.yaml ps
```

El frontend se publica en el puerto 80 temporalmente para demostración. Los puertos
8081 y 8082 quedan accesibles únicamente por localhost (túnel SSH para Postman).
Antes de publicarlo definitivamente configura HTTPS con un dominio/proxy y controles
para APIs de escritura, especialmente el foro que actualmente no exige JWT.
