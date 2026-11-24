# ${artifactId}

Microservicio generado por el arquetipo **cl.duoc.forofs3:microservicio-arquetipo:1.0.0**.

- Paquete Java: `${package}`
- Puerto solicitado en el arquetipo: `${servicePort}` (usar variable `PORT` al ejecutar)
- Capas de ejemplo: controller, service, dto.
- Dependencias listas: Spring MVC, JPA, Validation, Oracle JDBC.
- El esquema Oracle, entidades y repositorios de negocio se agregan para cada dominio.

## Ejecutar

Configurar las variables de entorno: `DB_URL`, `DB_USER`, `DB_PASSWORD` y `PORT=${servicePort}`.
La URL puede utilizar un Wallet Oracle: `jdbc:oracle:thin:@forofs3_low?TNS_ADMIN=RUTA_DEL_WALLET`.

```powershell
mvn spring-boot:run
```

Consultar `/api/estado` y `/api/estado/bd`. No copiar credenciales al repositorio.
