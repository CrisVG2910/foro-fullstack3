# Arquetipo Maven reutilizable — DSY2205 Sumativa 2

Este proyecto **sí es un arquetipo Maven**, no un POM copiado. Produce proyectos nuevos
Spring Boot 4.1.2 / Java 21 con paquetes según `-Dpackage`, Controllers, Service,
DTO, REST JSON, JPA, JDBC Oracle y configuración externa. Incluye prueba unitaria.

## Instalar (sin Maven global)

Abrir PowerShell en la raíz `foro-fullstack3`:

```powershell
.\usuarios-service\mvnw.cmd -f .\microservicio-arquetipo\pom.xml clean install -DskipTests
```

## Generar una aplicación a partir de esta plantilla

```powershell
.\usuarios-service\mvnw.cmd org.apache.maven.plugins:maven-archetype-plugin:3.4.1:generate -DarchetypeGroupId=cl.duoc.forofs3 -DarchetypeArtifactId=microservicio-arquetipo -DarchetypeVersion=1.0.0 -DgroupId=cl.duoc.forofs3 -DartifactId=prueba-arquetipo-service -Dversion=0.0.1-SNAPSHOT -Dpackage=cl.duoc.forofs3.prueba -DservicePort=8090 -DinteractiveMode=false
```

Revisar los archivos creados en `prueba-arquetipo-service/`.
La carpeta de demostración está en `.gitignore` para evitar desplegar un tercer servicio accidentalmente.

## Verificar generación

```powershell
.\usuarios-service\mvnw.cmd -f .\prueba-arquetipo-service\pom.xml test
```

### Sobre la arquitectura

- `controller`: API REST, DTO JSON
- `service`: lógica de negocio; inyección por constructor
- `dto`: contrato de respuestas
- `entity` y `repository`: agregar según el dominio; JPA/Oracle ya está listo en el POM

La plantilla incluye `server.port=${PORT:<servicePort>}` tras generar, con un valor por defecto parametrizable.

El usuario y foro **originales** se crearon antes de este arquetipo. Sus capas son compatibles,
pero no deben presentarse como generadas por el arquetipo. Para demostrar el arquetipo en Kaltura,
mostrar instalación + generación de un módulo de prueba.
