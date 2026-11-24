# Preparar despliegue de Sumativa 2 en VM Cloud con Docker Compose

Esta guía es **genérica**. Oracle Autonomous Database ya está en OCI, pero eso **no**
significa que exista una VM de aplicaciones; hay que provisionar una o usar un
servicio de contenedores. No se ha desplegado nada desde este paquete.

## Preparación de una VM Ubuntu 24.04

1. Crear una VM con conectividad saliente a `adb.sa-santiago-1.oraclecloud.com:1522`.
2. Instalar Docker Engine + Docker Compose Plugin siguiendo documentación oficial.
3. Configurar acceso SSH por clave. Cerrar las reglas de entrada que no sean necesarias.
4. Clonar el repositorio o transferir el proyecto sin `.env` ni Wallet vía Git:

```bash
git clone https://github.com/CrisVG2910/foro-fullstack3.git
cd foro-fullstack3
cp .env.example .env
```

5. Transferir el Wallet desde un equipo confiable por SCP/SFTP a `wallet/` de la VM
   (NO a GitHub; NO copiar dentro de la imagen Docker). Crear/editar `.env` con los secretos
   locales. Asegurar permisos privados:

```bash
sudo chown -R 10001:10001 wallet
sudo find wallet -type d -exec chmod 700 {} \;
sudo find wallet -type f -exec chmod 600 {} \;
chmod 600 .env
```

   Nota: las instrucciones de `chown` requieren sudo; se asume que ambos Java Dockerfiles
   utilizan UID 10001. Deja `DB_URL` apuntando a `/opt/oracle/wallet`.

6. Construir y levantar:

```bash
docker compose config --quiet
docker compose up -d --build
docker compose ps
docker compose logs --tail=100 usuarios
```

## Demostración de servicios sin exponer CRUD desprotegido

De forma predeterminada `PUBLISH_HOST=127.0.0.1`, así que NINGÚN puerto queda público.
Esto es intencional porque `foro-service` contiene endpoints de escritura sin autorización.

Para probar desde Postman en tu PC puedes abrir un túnel SSH hacia la VM:

```bash
ssh -L 8081:127.0.0.1:8081 -L 8082:127.0.0.1:8082 usuario@IP_DE_TU_VM
```

Usa `http://localhost:8081` y `http://localhost:8082` en Postman mientras dure el túnel.
Si tus servicios locales usan esos puertos, detén los procesos locales antes de abrir el túnel.

## Publicar el frontend

Si necesitas una URL pública para Kaltura, configura `PUBLISH_HOST=0.0.0.0` y
`FRONTEND_PORT=80` en `.env`, pero eso también publicaría los puertos Java en todas
las interfaces de Docker. **NO lo hagas con el compose tal como está** sin restringir
primero el acceso a 8081/8082 en la red/firewall de la VM y sin autorizar los endpoints.

Una alternativa más segura es editar SOLO la línea de `ports:` de `frontend` a
`"0.0.0.0:80:8080"`, mantener `PUBLISH_HOST=127.0.0.1` para los servicios Java,
y configurar HTTPS delante de Angular (dominio + proxy o servicio administrado).

La URL para el frontend sería `http://IP_DE_TU_VM/` temporalmente y HTTPS con dominio
para entrega estable. Para la evidencia de backend usar el túnel SSH o un proxy con
TLS/autenticación/autorización adecuada. Consultar al docente si exige APIs públicamente
accesibles, pues requieren endurecimiento adicional.

## Verificación

- Mostrar frontend Angular desde URL pública.
- Mostrar logs de ambos servicios, llamadas Postman y la instancia Oracle.
- Evitar mostrar `.env`, JWT, Wallet ni secretos en el video Kaltura.

## Opcional recomendado: subir imagenes al Registry

El proyecto incluye el workflow GitHub Actions `publicar-imagenes.yml` y un Compose
especifico `compose.cloud.yaml` que consume GHCR en lugar de construir en la VM.
Lee `docs/GUIA_REGISTRY_GHCR.md` para el procedimiento y para mantener 8081/8082 privados.
