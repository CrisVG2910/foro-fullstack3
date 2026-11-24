# Sumativa 2 — Arquetipo, Git y Docker

El paquete se diseñó como **parche aditivo** para el proyecto existente. No reemplaza
ningún código Angular ni las entidades Spring Boot.

## A. Integración

1. Respaldar el proyecto o hacer un commit previo.
2. Extraer el ZIP en `C:\Proyectos\foro-fullstack3\` conservando las rutas.
3. Verificar que los archivos `Dockerfile` aparezcan dentro de cada servicio.
4. Verificar que exista `frontend-angular/package-lock.json` (generado por npm).
5. **No sustituir nunca el Wallet por el del ZIP:** este paquete no incluye secretos.

## B. Preparar variables y Wallet

En PowerShell, desde la raíz:

```powershell
Copy-Item .env.example .env
```

Abrir `.env` en VS Code y reemplazar:
- `DB_PASSWORD` con la clave **nueva/rotada** de FORO_APP.
- `JWT_SECRET` con la clave Base64 de 32 bytes.

Si necesitas generar `JWT_SECRET` en PowerShell 5.1:

```powershell
$bytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
try { $rng.GetBytes($bytes) } finally { $rng.Dispose() }
[Convert]::ToBase64String($bytes)
```

Copia ese valor a `.env`, sin comillas; no lo envíes por chat ni lo subas a Git.
Si regeneras la clave, los tokens previos dejarán de servir.

Verifica los archivos del Wallet en `foro-fullstack3/wallet/`, especialmente `tnsnames.ora`.
Para el contenedor `TNS_ADMIN` es `/opt/oracle/wallet`, NO una ruta de Windows.

Si el archivo `sqlnet.ora` conserva una ruta Windows, debes cambiarla al directorio del
contenedor y/o usar el parámetro TNS_ADMIN como en la URL JDBC. Prueba el endpoint `/api/estado/bd`.

## C. Docker local

Detener temporalmente `npm start` y ambos `mvnw.cmd spring-boot:run`, para evitar colisiones de puertos.

Instalar y abrir Docker Desktop con Linux containers; verificar:

```powershell
docker --version
docker compose version
docker info
docker compose config --quiet
```

Construir y levantar:

```powershell
docker compose up -d --build
docker compose ps
docker compose logs --tail=100 usuarios
docker compose logs --tail=100 foro
```

Pruebas:
- FrontEnd: http://localhost:4200/
- Usuarios: http://localhost:8081/api/estado/bd
- Foro: http://localhost:8082/api/estado/bd
- Categorias: http://localhost:8082/api/categorias

La interfaz Angular es independiente del Backend por requerimiento de esta sumativa.
Por tanto, que Angular muestre temas **no significa** que los haya leído desde Oracle.

Para detener contenedores:

```powershell
docker compose down
```

No uses `docker compose down -v` en un proyecto con datos persistentes si no quieres borrar volúmenes.

## D. Evidencias que conviene capturar

1. `docker compose ps` mostrando frontend, usuarios, foro.
2. `docker compose logs` sin errores de inicialización.
3. Tres tamaños de Angular (móvil, tablet, escritorio).
4. `/api/estado/bd` para ambos servicios.
5. Postman CRUD de usuarios y foro, y consultas Oracle de tablas.
6. `mvn install` del arquetipo y generación de `prueba-arquetipo-service`.
7. Commits y ramas `feature/*` en GitHub.
8. URL pública del frontend desplegado en Cloud (si se configura infraestructura y acceso).

## E. Consideraciones

- No subir `.env` ni el Wallet al repositorio.
- Si `.env` o Wallet ya estuvieran versionados, `.gitignore` NO los elimina del historial.
- `foro-service` de Sumativa 1 tiene endpoints de escritura sin autenticación; no se deben
  exponer libremente a Internet sin controles adicionales.
- Los originales de Sumativa 1 NO se generaron con este arquetipo. Se incluye plantilla
  funcional y el procedimiento para demostrar un nuevo microservicio generado.
- El despliegue real en Cloud requiere una VM/servicio de contenedores, permisos y red.
  Este ZIP prepara imágenes/Compose, no crea infraestructura ni una URL pública.

## F. Registry en la nube

Para evidenciar Container Registry, subir el workflow `.github/workflows/publicar-imagenes.yml`
a GitHub, confirmar las tres imagenes en GHCR y usar `compose.cloud.yaml` en la VM.
Ver `docs/GUIA_REGISTRY_GHCR.md`.
